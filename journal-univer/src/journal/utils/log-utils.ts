import {
  Disposable,
  ILogService,
  Inject,
  Injector,
  LogLevel,
} from "@univerjs/presets";

export type LogType = "console" | "univer";

export class JournalLogUtils extends Disposable {
  private readonly logType: LogType = "console";
  constructor(
    config: null,
    // 可通过this._injector.get(IUniverInstanceService)可以获取对应的模块
    @Inject(Injector) readonly _injector: Injector,
    // 注入配置服务
    @ILogService private readonly _logService: ILogService
  ) {
    super();
  }

  debug(...args: any): void {
    if (this.logType === "univer") {
      this._logService.debug(...args);
    } else {
      console.debug(...args);
    }
  }

  log(...args: any): void {
    if (this.logType === "univer") {
      this._logService.log(...args);
    } else {
      console.log(...args);
    }
  }
  warn(...args: any): void {
    if (this.logType === "univer") {
      this._logService.warn(...args);
    } else {
      console.warn(...args);
    }
  }
  error(...args: any): void {
    if (this.logType === "univer") {
      this._logService.error(...args);
    } else {
      console.error(...args);
    }
  }
  deprecate(...args: any): void {
    if (this.logType === "univer") {
      this._logService.deprecate(...args);
    } else {
      console.error(...args);
    }
  }
  setLogLevel(enabled: LogLevel): void {
    this._logService.setLogLevel(enabled);
  }
}
