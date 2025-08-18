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
  private _changeRecords: IChangeRecord[] = [];
  private _uploading: boolean = false; // 是否正在更新中

  constructor(
    _config: null,
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
