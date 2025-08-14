import { Disposable, ILogService, Inject, Injector } from "@univerjs/presets";

/**
 * 一个最基本的Service示例。
 * Service主要用于处理业务逻辑
 */
export interface ISimpleDemoService {
  /** 处理业务逻辑 */
  doSomthing(): void;
}

/**
 * 一个最基本的Service实现示例。
 * Service主要用于处理业务逻辑
 */
export class SimpleDemoService
  extends Disposable
  implements ISimpleDemoService
{
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
