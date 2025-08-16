import {
  IConfigService,
  ILogService,
  Inject,
  Injector,
  merge,
  Plugin,
  UniverInstanceType,
} from "@univerjs/presets";
import {
  CONFIG_JOURNAL_UNIVER_SYMBOL,
  DefaultJournalUniverConfig,
  type IJournalUniverConfig,
} from "../common/config";
import { PLUGIN_SERVER_DATA } from "../common/const";

/**
 * 与服务端数据交互的插件
 */
export default class ServerDataPlugin extends Plugin {
  static override type = UniverInstanceType.UNIVER_SHEET;
  static override pluginName = PLUGIN_SERVER_DATA;

  constructor(
    // 插件配置
    _config: Partial<IJournalUniverConfig> = DefaultJournalUniverConfig,
    // 可通过this._injector.get(IUniverInstanceService)可以获取对应的服务
    @Inject(Injector) readonly _injector: Injector,
    // 注入配置服务（可选）
    @Inject(IConfigService) private readonly _configService: IConfigService,
    // 注入日志服务
    @Inject(ILogService) private readonly _logService: ILogService
  ) {
    _logService.log("[ServerDataPlugin]", "constructor");

    super();
    // 加载配置
    const { ...rest } = merge({}, DefaultJournalUniverConfig, _config);
    this._configService.setConfig(CONFIG_JOURNAL_UNIVER_SYMBOL, rest);
  }

  override onStarting(): void {
    this._logService.log("[ServerDataPlugin]", "onStarting");

    // 在onStarting注册插件的依赖模块，需要注意先后顺序
    // ([[SimpleDemoService], [SimpleDemoController]] as Dependency[]).forEach(
    //   (d) => this._injector.add(d)
    // );

    // @todo 保证模块已经注册，官方源码分别在不同的生命周期函数中touch，原因待考证
    // touchDependencies(this._injector, [[SimpleController], [SimpleService]]);
  }

  override onReady(): void {
    this._logService.log("[ServerDataPlugin]", "onReady");
  }

  override onRendered(): void {
    this._logService.log("[ServerDataPlugin]", "onRendered");
  }

  override onSteady(): void {
    this._logService.log("[ServerDataPlugin]", "onSteady");
  }
}
