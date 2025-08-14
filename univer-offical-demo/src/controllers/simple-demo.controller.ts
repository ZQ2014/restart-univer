import { Disposable, ILogService, Inject, Injector } from "@univerjs/presets";

/**
 * 一个最基本的Controller示例。
 * Controller主要用于注册自定义UI组件、命令，初始化menu等
 */
export class SimpleDemoController extends Disposable {
  constructor(
    _config: null,
    // 可通过this._injector.get(IUniverInstanceService)可以获取对应的模块
    @Inject(Injector) readonly _injector: Injector,
    // 注入日志服务
    @ILogService private readonly _logService: ILogService
  ) {
    super();
    this._logService.log("[SimpleDemoController]", "constructor");
    this._initSomething();
  }

  /** 初始化一些操作 */
  private _initSomething(): void {
    this._logService.log("[SimpleDemoController]", "_initSomething");
  }
}
