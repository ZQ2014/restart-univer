import {
  Disposable,
  ICommandService,
  IConfigService,
  Inject,
  Injector,
  merge,
} from "@univerjs/presets";
import {
  ComponentManager,
  ContextMenuGroup,
  ContextMenuPosition,
  IMenuManagerService,
  RibbonStartGroup,
  type IDialogPartMethodOptions,
} from "@univerjs/presets/preset-sheets-core";
import { JournalLogUtils } from "../../utils/log-utils";
import UIUtils from "../../utils/ui-utils";
import { CHANGE_TRACKER_COMPONENTS } from "../components/components";
import {
  defaultChangeTrackerConfig,
  type IChangeTrackerConfig,
} from "../common/config";
import {
  COMPONENT_INFO_ICON,
  COMPONENT_WARNING_ICON,
  CONFIG_KEY_CHANGE_TRACKER,
  DIALOG_UNSAVED_CHANGE,
  MENU_BUTTON_UPLOAD_CHANGE_RECORDS,
} from "../common/const";
import { CHANGE_TRACKER_COMMANDS } from "../commands/commands/change-tracker.command";
import { UploadChangeRecordsButtonFactory } from "./change-tracker.menu";
import { univerAPI } from "../../../main-univer";
import { ChangeTrackerService } from "../services/change-tracker.service";
import ServerDataService from "../../server-data/services/server-data.service";

export type UnsavedChangeDialogResult =
  | "save&switch"
  | "no-save&switch"
  | "no-save&no-switch";

export class ChangeTrackerController extends Disposable {
  // 用户编辑单元格的样式配置
  private readonly _config;
  constructor(
    _config: Partial<IChangeTrackerConfig> = defaultChangeTrackerConfig,
    // 可通过this._injector.get(IUniverInstanceService)可以获取对应的服务
    @Inject(Injector) readonly _injector: Injector,
    // 注入配置服务
    @Inject(IConfigService) private readonly _configService: IConfigService,
    // 注入组件管理器，用于管理UI组件，这些组件将用于构成Button、Menu、Notification、Dialog、Comfirm等
    @Inject(ComponentManager)
    private readonly _componentManager: ComponentManager,
    // 注入命令服务，用于注册命令，以通知Univer执行特定操作的事件并实现与之对应得执行代码
    @Inject(ICommandService) private readonly _commandService: ICommandService,
    // 注入菜单管理器
    @Inject(IMenuManagerService)
    private readonly _menuManagerService: IMenuManagerService,
    // 注入通知用户交互工具包（对话框、通知、消息等）
    @Inject(UIUtils)
    private readonly _UIUtils: UIUtils,
    // 注入变更跟踪服务
    @Inject(ChangeTrackerService)
    private readonly _changeTrackerService: ChangeTrackerService,
    // 注入自定义日志服务
    @Inject(JournalLogUtils) private readonly _logService: JournalLogUtils
  ) {
    super();
    this._debug("constructor");

    // 加载配置
    this._config = merge(
      {},
      defaultChangeTrackerConfig,
      this._configService.getConfig<IChangeTrackerConfig>(
        CONFIG_KEY_CHANGE_TRACKER
      ),
      _config
    );

    this._initComponents();
    this._initCommands();
    this._initMenus();
    this._initHandle();
  }
  _initComponents() {
    CHANGE_TRACKER_COMPONENTS.forEach((value, key) => {
      this._componentManager.register(key, value);
    });
  }
  //HACK 待补充命令
  _initCommands() {
    CHANGE_TRACKER_COMMANDS.forEach((c) => {
      this.disposeWithMe(this._commandService.registerCommand(c));
    });
  }
  _initMenus() {
    this._menuManagerService.mergeMenu({
      // 顶部开始菜单
      [RibbonStartGroup.OTHERS]: {
        [MENU_BUTTON_UPLOAD_CHANGE_RECORDS]: {
          order: 0,
          menuItemFactory: UploadChangeRecordsButtonFactory,
          title: "RibbonStartGroup.OTHERS", //实际执行中，未出现
        },
      },
      // 主区域的右键菜单
      [ContextMenuPosition.MAIN_AREA]: {
        [ContextMenuGroup.OTHERS]: {
          [MENU_BUTTON_UPLOAD_CHANGE_RECORDS]: {
            order: 0,
            menuItemFactory: UploadChangeRecordsButtonFactory,
          },
        },
      },
    });
  }
  private _initHandle(): void {
    // 注册监听
    //TODO 待监听工作簿切换
    // univerAPI.addEvent(univerAPI.Event.BeforeAct, (params) => {
    //   const { worksheet, workbook, row, column, value } = params;
    //   console.log(`单元格被点击，行：${row}，列：${column}`);
    // });
    // 监听工作表切换
    const beforeActiveSheetChangeListener = univerAPI.addEvent(
      univerAPI.Event.BeforeActiveSheetChange,
      async (params) => {
        // const { workbook, activeSheet, oldActiveSheet } = params;
        this._debug("Event.BeforeActiveSheetChange", params);
        try {
          const r = await this._handleWorkbookOrWorksheetChange();
          params.cancel = !r;
        } catch (error) {
          this._error("outside _handleWorkbookOrWorksheetChange", error);

          this._UIUtils.showNotification(
            "异常！",
            "切换工作表时发生错误，请注意可能存在未保存数据！即将切换工作表……",
            "error"
          );
          params.cancel = false;
        }
      }
    );

    // 监听单元格修改
    const sheetEditEndedListener = univerAPI.addEvent(
      univerAPI.Event.SheetEditEnded,
      (params) => {
        const {
          worksheet,
          workbook,
          row,
          column,
          eventType,
          keycode,
          isZenEditor,
          isConfirm,
        } = params;
        this._debug("Event.SheetEditEnded", params);
        // 如果本次编辑被取消，则不处理
        if (!isConfirm) return;

        //HACK 待补充具体处理
      }
    );

    // 取消监听
    this.disposeWithMe(() => {
      beforeActiveSheetChangeListener.dispose();
      sheetEditEndedListener.dispose();
    });
  }

  /**
   * 工作簿或工作表切换监听的回调函数，根据是否存在未保存的变化和用户选择决定是否切换。
   *
   * @returns Promise<boolean> - true表示切换，false表示取消操作
   */
  private async _handleWorkbookOrWorksheetChange(): Promise<boolean> {
    this._debug("_handleWorkbookOrWorksheetChange");

    // 如果正在更新数据，则不允许切换，提示后返回
    if (this._changeTrackerService.isUploading()) {
      this._debug("正在保存数据，不允许切换工作簿或工作表");
      this._UIUtils.showNotification(
        "提示：",
        "正在保存数据，请稍后再试！",
        "message"
      );
      return false;
    }

    // 如有未保存的修改记录，则提示用户保存，否则清除记录
    if (this._changeTrackerService.hasUnsavedChanges()) {
      try {
        const dialogResult = await this._showUnsavedChangeDialog();
        switch (dialogResult) {
          case "save&switch":
            try {
              //HACK
              this._debug("_handleWorkbookOrWorksheetChange", "ave&switch");
              // 保存并切换：
              //TODO 为避免窗口重叠，需注意上传数据时使用通知，不使用对话框
              // 上传修改记录
              const updateResult =
                await this._serverDataService.uploadChangeRecords();
              // 关闭对话框
              if (!updateResult || updateResult.success !== "success") {
                //TODO 观察是否通知会重叠
                this._UIUtils.showNotification(
                  "错误：",
                  "保存失败，取消切换，请重试或联系管理员。",
                  "error"
                );
                this._UIUtils.closeDialog(DIALOG_UNSAVED_CHANGE);
                resolve(false);
              } else {
                this._UIUtils.showNotification("", "保存成功，即将切换……");
                this._UIUtils.closeDialog(DIALOG_UNSAVED_CHANGE);
                resolve(true);
              }
            } catch (error) {
              this._error("_showUnsavedChangeDialog", "onOk异常", error);
              this._UIUtils.showNotification(
                "错误：",
                "保存失败，取消切换，请重试或联系管理员。",
                "error"
              );
              this._UIUtils.closeDialog(DIALOG_UNSAVED_CHANGE);
              resolve(false);
            }
            return true;
          case "no-save&switch":
            this._debug("_handleWorkbookOrWorksheetChange", "no-save&switch");
            // 不保存并切换：清除待更新记录并返回true
            this._changeTrackerService.clearAllRecords();
            return true;
          case "no-save&no-switch":
            this._debug(
              "_handleWorkbookOrWorksheetChange",
              "no-save&no-switch"
            );
            return false;
        }
      } catch (error) {
        // 捕获异常，提示告警并拒绝切换
        this._error("outside _showUnsavedChangeDialog", error);
        this._UIUtils.showNotification(
          "异常！",
          "保存数据时发生错误，请注意可能存在未保存数据！即将切换工作表……",
          "error"
        );
        return true;
      }
    }

    // 两者皆无，允许切换
    return true;
  }

  // 以下写法更优雅，但编译报错，必须添加最后一个返回才能编译通过
  // private async _showUnsavedChangeDialog(): Promise<UnsavedChangeDialogResult> {
  //   this._debug("_showUnsavedChangeDialog");
  //   const opts: IDialogPartMethodOptions = {
  //     id: DIALOG_UNSAVED_CHANGE,
  //     title: { label: COMPONENT_INFO_ICON, title: "重要!" },
  //     children: {
  //       title:
  //         "正在切换工作表，当前工作表有未保存的修改，需要保存吗？<br>" + //FIXME 检查<br>是否生效
  //         "  确认：保存并切换<br>" +
  //         "  取消：不保存并切换<br>" +
  //         "  关闭：取消切换（未保存）",
  //     },
  //     width: 500, //FIXME 检查dialog宽度是否合适
  //     draggable: false,
  //     // mask: true,
  //     maskClosable: false,
  //     // closable: true,
  //     showOk: true,
  //     showCancel: true,
  //     onClose: () => {
  //       this._debug("_showUnsavedChangeDialog", "onClose");
  //       this._UIUtils.closeDialog(DIALOG_UNSAVED_CHANGE);
  //       return Promise.resolve("no-save&no-switch");
  //     },
  //     onOk: async () => {
  //       this._debug("_showUnsavedChangeDialog", "onOk");
  //       this._UIUtils.closeDialog(DIALOG_UNSAVED_CHANGE);
  //       return Promise.resolve("save&switch");
  //     },
  //     onCancel: () => {
  //       this._debug("_showUnsavedChangeDialog", "onCancel");
  //       this._UIUtils.closeDialog(DIALOG_UNSAVED_CHANGE);
  //       return Promise.resolve("no-save&switch");
  //     },
  //   };

  //   let dialog = this._UIUtils.openDialogByOpts(opts);
  //   if (!dialog) {
  //     this._error("_showUnsavedChangeDialog", "dialog失败");
  //     return Promise.reject("打开DIALOG_UNSAVED_CHANGE失败");
  //   }
  //   // return Promise.reject();
  // }

  private async _showUnsavedChangeDialog(): Promise<UnsavedChangeDialogResult> {
    this._debug("_showUnsavedChangeDialog");
    return new Promise((resolve, reject) => {
      const opts: IDialogPartMethodOptions = {
        id: DIALOG_UNSAVED_CHANGE,
        title: { label: COMPONENT_INFO_ICON, title: "重要!" },
        children: {
          title:
            "正在准备切换工作表，当前工作表有未保存的修改，需要保存吗？<br>" + //FIXME 检查<br>是否生效
            "  确认：保存并切换<br>" +
            "  取消：不保存并切换<br>" +
            "  关闭：取消切换（未保存）",
        },
        width: 500, //FIXME 检查dialog宽度是否合适
        draggable: false,
        mask: true,
        maskClosable: false,
        closable: true,
        showOk: true,
        showCancel: true,
        onClose: () => {
          this._debug("_showUnsavedChangeDialog", "onClose");
          this._UIUtils.closeDialog(DIALOG_UNSAVED_CHANGE);
          resolve("no-save&no-switch");
        },
        onOk: async () => {
          this._debug("_showUnsavedChangeDialog", "onOk");
          this._UIUtils.closeDialog(DIALOG_UNSAVED_CHANGE);
          resolve("save&switch");
        },
        onCancel: () => {
          this._debug("_showUnsavedChangeDialog", "onCancel");
          this._UIUtils.closeDialog(DIALOG_UNSAVED_CHANGE);
          resolve("no-save&switch");
        },
      };

      let dialog = this._UIUtils.openDialogByOpts(opts);
      if (!dialog) {
        this._error("_showUnsavedChangeDialog", "dialog失败");
        reject("打开DIALOG_UNSAVED_CHANGE失败");
      }
    });
  }

  /**
   * 处理用户修改单元格内容的回调函数
   * @param workbookId
   * @param worksheetId
   * @param row
   * @param col
   * @param oldValue
   * @param newValue
   * @param fromVersion
   */
  private _handleCellValueChange(
    workbookId: string,
    worksheetId: string,
    row: number,
    col: number,
    oldValue: any,
    newValue: any,
    fromVersion?: string
  ): void {
    this._debug("_handleCellValueChange");

    // 创建记录
    const record: IChangeRecord = {
      id: this._generateRecordId(),
      workbookId,
      worksheetId,
      row,
      col,
      oldValue,
      newValue,
      fromVersion,
      status: "pending",
      timestamp: Date.now(),
    };

    // 添加到记录列表
    this._changeRecords.push(record);

    // 更新单元格样式
    this._updateCellStyle(record);
  }

  // 生成随机记录ID
  private _generateRecordId(): string {
    return `rec_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  // 根据记录更新单元格样式
  private _updateCellStyle(record: IChangeRecord): void {
    this._debug("updateCellStyle", record);

    const { workbookId, worksheetId, row, col, status } = record;

    const fWorkbook = univerAPI.getWorkbook(workbookId);
    const fWorksheet = fWorkbook?.getSheetBySheetId(worksheetId);
    const fRange = fWorksheet?.getRange(row, col);
    if (!fWorkbook || !fWorksheet || !fRange) {
      this._error(
        "_updateCellStyle",
        "workbook or worksheet or range is null",
        workbookId,
        fWorkbook,
        worksheetId,
        fWorksheet,
        fRange
      );
      return;
    }

    //TODO “样式”应该优化为类似批注的角标
    // 获取样式
    const style = this._config.styles?.[status];

    if (style) {
      // 应用样式
      //TODO 是否会冲掉已有的样式，用户是否能够编辑样式
      // fRange.getCellStyle();
      fRange.setValueForCell({ s: style });

      // 如果状态是“已更新”，设置定时清除样式
      if (status === "updated" && this._config.clearStyleDelay) {
        setTimeout(() => {
          // 清除样式前检查记录状态是否仍然是updated
          const currentRecord = this._changeRecords.find(
            (r) => r.id === record.id
          );
          if (currentRecord && currentRecord.status === "updated") {
            const currentStype = fRange.getCellStyleData();
            if (currentStype === style) {
              //TODO 是否会冲掉已有的其他样式
              fRange.setValueForCell({ s: undefined });
            }
          }
        }, this._config.clearStyleDelay);
      }
    } else {
      this._warn(
        "_updateCellStyle",
        "未找到该修改记录状态所对应的样式信息",
        status
      );
    }
  }

  // 留存一段使用命令修改样式的代码
  // private _syncExecuteSetStyleCommand<T>(
  //   workbookId: string,
  //   sheetId: string,
  //   range: IRange,
  //   style: IStyleTypeValue<T>
  // ): boolean {
  //   const setStyleParams: ISetStyleCommandParams<T | null> = {
  //     unitId: workbookId,
  //     subUnitId: sheetId,
  //     range,
  //     style,
  //   };
  //   const r = this._commandService.syncExecuteCommand(
  //     SetStyleCommand.id,
  //     setStyleParams
  //   );

  //   if (!r) {
  //     this._logService.warn(
  //       "[ChangeTrackerService]",
  //       "_syncExecuteSetStyleCommand failed"
  //     );
  //   }

  //   return r;
  // }
  private _debug(...args: any) {
    this._logService.debug("[ChangeTrackerController]", ...args);
  }
  private _log(...args: any) {
    this._logService.log("[ChangeTrackerController]", ...args);
  }

  private _warn(...args: any) {
    this._logService.warn("[ChangeTrackerController]", ...args);
  }

  private _error(...args: any) {
    this._logService.error("[ChangeTrackerController]", ...args);
  }

  // private _deprecate(...args: any) {
  //   this._logService.deprecate("[ChangeTrackerService]", ...args);
  // }
}
