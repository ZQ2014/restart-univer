import { Disposable, ILogService, Inject, Injector } from "@univerjs/presets";
import type { IUpdateParam } from "../server-data/server-data.service";

/**
 * 一个最基本的Service示例。
 * Service主要用于处理业务逻辑
 */
export interface IModificationRecordService {
  /** 处理业务逻辑 */
  doSomthing(): void;
}

/**
 * 一个最基本的Service实现示例。
 * Service主要用于处理业务逻辑
 */
export class ModificationRecordService
  extends Disposable
  implements IModificationRecordService
{
  // 用户已经修改但是没有保存的数据集
  private _editRecordMap = new Map<string, IUpdateParam>();
  // 正在更新的数据集，用于显示是否更新成功及再次更新
  private _updateRecordMap = new Map<string, IUpdateParam>();
  constructor(
    _config: null,
    // 可通过this._injector.get(IUniverInstanceService)可以获取对应的模块
    @Inject(Injector) readonly _injector: Injector,
    // 注入日志服务
    @ILogService private readonly _logService: ILogService
  ) {
    super();
    this._logService.log("[SimpleDemoService]", "constructor");
  }

  doSomthing(): void {
    this._logService.log("[SimpleDemoService]", "doSomthing");
  }
}
