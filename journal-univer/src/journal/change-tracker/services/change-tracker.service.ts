import type { IDialogPartMethodOptions } from "@univerjs/preset-sheets-core";
import {
  Disposable,
  IConfigService,
  Inject,
  Injector,
  merge,
} from "@univerjs/presets";
import { univerAPI } from "../../../main-univer";
import type { IUpdateResult } from "../../server-data/services/server-data.service";
import IServerDataService from "../../server-data/services/server-data.service";
import { JournalLogUtils } from "../../utils/log-utils";
import UIUtils from "../../utils/ui-utils";
import {
  defaultChangeTrackerConfig,
  type IChangeTrackerConfig,
} from "../common/config";
import {
  CONFIG_KEY_CHANGE_TRACKER,
  DIALOG_UNSAVED_CHANGE,
} from "../common/const";
import { COMPONENT_WARNING_ICON } from "../components/components";

// 修改记录
export interface IChangeRecord {
  id: string; // 唯一标识
  workbookId: string;
  worksheetId: string;
  row: number;
  col: number;
  oldValue: any; // 修改前的值
  newValue: any; // 修改后的值
  fromVersion?: string; // 修改前的版本
  status: "pending" | "updating" | "updated" | "failed";
  timestamp: number;
}

/**
 * 用户编辑内容的跟踪器
 * //TODO 做一次解耦重构，用户交互逻辑由controller统一负责、避免多次异常弹出提醒等，service只负责单纯的业务逻辑、真实反馈业务状态即可
 */
export class ChangeTrackerService extends Disposable {
  private readonly _config;
  private _changeRecords: IChangeRecord[] = [];
  private _uploading: boolean = false; // 是否正在更新中

  constructor(
    config: Partial<IChangeTrackerConfig> = defaultChangeTrackerConfig,
    // 可通过this._injector.get(IUniverInstanceService)可以获取对应的模块
    @Inject(Injector) readonly _injector: Injector,
    // 注入配置服务
    @Inject(IConfigService) private readonly _configService: IConfigService,
    // 注入配置服务
    @Inject(IServerDataService)
    private readonly _serverDataService: IServerDataService,
    // 注入通知用户交互工具包（对话框、通知、消息等）
    @Inject(UIUtils)
    private readonly _UIUtils: UIUtils,
    // // 注入获取当前Univer实例的服务，用于管理工作簿并与之交互
    // @Inject(IUniverInstanceService)
    // private readonly _univerInstanceService: IUniverInstanceService,
    // // 注入命令服务，用于注册命令，以通知Univer执行特定操作的事件并实现与之对应得执行代码
    // @Inject(ICommandService) private readonly _commandService: ICommandService,
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
      config
    );

    this._initHandle();

    this.disposeWithMe(() => {
      this._changeRecords = [];
    });
  }
  /**
   * 提取pending和failed状态的记录并批量上传
   * @returns Promise<IUpdateResult> 批量上传结果
   */
  async uploadChangeRecords(): Promise<IUpdateResult> {
    // try {
    //TODO
    this._debug("uploadChangeRecords");

    if (this.isUploading()) {
      this._log("uploadChangeRecords", "already uploading");
      return Promise.reject("uploadChangeRecords: already uploading");
    }

    this._uploading = true;

    // 筛选待处理和更新失败的记录
    const recordsToUpload = this._changeRecords.filter(
      (record) => record.status === "pending" || record.status === "failed"
    );

    // 更新记录状态
    recordsToUpload.forEach((record) => {
      //因为是浅拷贝，_changeRecords同步更新
      record.status = "updating";
      this._updateCellStyle(record);
    });

    // 调用服务上传记录
    let uploadResult = null;
    try {
      uploadResult = await this._serverDataService.uploadChangeRecords(
        recordsToUpload
      );
    } catch (error) {
      this._error("uploadChangeRecords", "上传修改记录时发生异常", error);
      // 记录状态全部回滚
      recordsToUpload.forEach((record) => {
        //因为是浅拷贝，_changeRecords同步更新
        record.status = "failed";
        this._updateCellStyle(record);
      });
      this._uploading = false;
      return Promise.reject("uploadChangeRecords: 上传修改记录时捕获异常");
    }

    if (!uploadResult || uploadResult.success === "failed") {
      recordsToUpload.forEach((record) => {
        record.status = "failed";
        this._updateCellStyle(record);
      });
      this._uploading = false;
      return Promise.reject("uploadChangeRecords: 上传修改记录失败");
    } else {
      uploadResult.recordResults.forEach((recordResult) => {
        const record = recordsToUpload.find(
          (r) => r.id === recordResult.recordId
        );
        if (record && record.status === "updating") {
          record.status = recordResult.success ? "updated" : "failed";
          this._updateCellStyle(record);
        }
      });
      this._uploading = false;
      return Promise.resolve(uploadResult);
    }
    // } catch (error) {
    //   this._error("uploadChangeRecords", "失败", error);
    //   this._UIUtils.showNotification(
    //     "提示：",
    //     "保存修改记录失败，请联系管理员！",
    //     "error"
    //   );
    //   return false;
    // }
  }

  // 获取当前工作表是否有未保存修改
  hasUnsavedChanges(): boolean {
    return (
      this._changeRecords.length !== 0 &&
      this._changeRecords.find((record) => record.status !== "updated") !==
        undefined
    );
  }

  // 获取所有记录
  getAllRecords(): IChangeRecord[] {
    // 返回副本
    return [...this._changeRecords];
  }

  // 清除所有记录
  clearAllRecords(): void {
    this._debug("clearAllRecords");
    this._changeRecords.length = 0;
  }

  // 获取当前是否正在上传数据
  isUploading(): boolean {
    return this._uploading;
  }

  private _initHandle(): void {
    //TODO 注册监听
    // const context = this.getContext();
    // // 监听工作簿切换
    // context.getObserverManager().getObserver('onAfterChangeWorkbook')?.add((workbookId: string) => {
    //   this._handleWorkbookChange(workbookId);
    // });
    // // 监听工作表切换
    // context.getObserverManager().getObserver('onAfterChangeWorksheet')?.add((worksheetId: string) => {
    //   this._handleWorksheetChange(worksheetId);
    // });
    // // 监听单元格修改
    // context.getObserverManager().getObserver('onCellContentChange')?.add((params: any) => {
    //   this.private _handleCellValueChange(params);
    // });
  }
  /**
   * 工作簿或工作表切换监听的回调函数，根据是否存在未保存的变化和用户选择决定是否切换。
   *
   * @returns Promise<boolean> - true表示切换，false表示取消操作
   */
  private async _handleWorkbookOrWorksheetChange(): Promise<boolean> {
    try {
      this._debug("_handleWorkbookOrWorksheetChange");

      // 如果正在更新数据，则不允许切换，提示后返回
      if (this.isUploading()) {
        this._log("正在更新数据，不允许切换工作簿或工作表");
        this._UIUtils.showNotification(
          "提示：",
          "正在更新数据，请稍后再试！",
          "warning"
        );
        return false;
      }

      // 如有未保存的修改记录，则提示用户保存，否则清除记录
      if (this.hasUnsavedChanges()) {
        return await this._showUnsavedChangeDialog();
      }

      // 两者皆无，允许切换
      return true;
    } catch (error) {
      // 捕获异常，提示告警并拒绝切换
      this._error("_handleWorkbookOrWorksheetChange", "异常", error);
      this._UIUtils.showNotification(
        "提示：",
        "处理更新数据数据时发生异常，请联系管理员！",
        "error"
      );
      return false;
    }
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

  /**
   * 显示未保存更改确认对话框
   *
   * @returns Promise<boolean> - true表示切换，false表示取消切换
   *
   * 该函数用于在用户尝试切换工作表但存在未保存修改时，显示确认对话框。
   * 用户可以选择保存并切换、取消保存并切换、取消切换（关闭窗口）。
   * 如上传数据失败则直接取消切换。
   */
  private async _showUnsavedChangeDialog(): Promise<boolean> {
    this._debug("_showUnsavedChangeDialog");
    return new Promise((resolve, reject) => {
      try {
        // 三种状态：保存并切换、取消保存并切换、取消切换
        const opts: IDialogPartMethodOptions = {
          id: DIALOG_UNSAVED_CHANGE,
          title: { label: COMPONENT_WARNING_ICON, title: "请注意：" },
          children: {
            title:
              "当前工作表有未保存的修改，确定要切换吗？<br>" + //TODO 检查<br>是否生效
              "  确认：保存并切换<br>" +
              "  取消：取消切换（未保存）<br>" +
              "  关闭：不保存并切换",
          },
          width: 500,
          draggable: false,
          // mask: true,
          maskClosable: false,
          // closable: true,
          showOk: true,
          showCancel: true,
          onClose: () => {
            this._debug("_showUnsavedChangeDialog", "onCancel");
            // 不保存并切换：清除待更新记录并返回true
            this.clearAllRecords();
            this._UIUtils.closeDialog(DIALOG_UNSAVED_CHANGE);
            resolve(true);
          },
          onOk: async () => {
            try {
              this._debug("_showUnsavedChangeDialog", "onOk");
              // 保存并切换：
              // 暂时不关闭对话框以保持遮罩层禁止用户操作
              //TODO 为避免窗口重叠，需注意上传数据时使用通知，不使用对话框
              // 上传修改记录
              const updateResult = await this.uploadChangeRecords();
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
          },
          onCancel: () => {
            this._debug("_showUnsavedChangeDialog", "onClose");
            // 取消切换（未保存）：什么都不做，直接返回false
            this._UIUtils.closeDialog(DIALOG_UNSAVED_CHANGE);
            resolve(false);
          },
        };
        let dialog = this._UIUtils.openDialogByOpts(opts);
        if (!dialog) {
          this._error("_showUnsavedChangeDialog", "dialog失败");
          this._UIUtils.showNotification(
            "错误：",
            "保存失败，取消切换，请重试或联系管理员。",
            "error"
          );
          this._UIUtils.closeDialog(DIALOG_UNSAVED_CHANGE);
          resolve(false);
        }
      } catch (error) {
        this._error("_showUnsavedChangeDialog", "用户交互中异常", error);
        this._UIUtils.closeDialog(DIALOG_UNSAVED_CHANGE);
        reject(error);
      }
    });
  }

  private _debug(...args: any) {
    this._logService.debug("[ChangeTrackerService]", ...args);
  }
  private _log(...args: any) {
    this._logService.log("[ChangeTrackerService]", ...args);
  }

  private _warn(...args: any) {
    this._logService.warn("[ChangeTrackerService]", ...args);
  }

  private _error(...args: any) {
    this._logService.error("[ChangeTrackerService]", ...args);
  }

  // private _deprecate(...args: any) {
  //   this._logService.deprecate("[ChangeTrackerService]", ...args);
  // }
}
