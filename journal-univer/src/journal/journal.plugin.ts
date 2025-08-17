import {
  IConfigService,
  ILogService,
  Inject,
  Injector,
  merge,
  Plugin,
  touchDependencies,
  UniverInstanceType,
  type Dependency,
} from "@univerjs/presets";
import { PLUGIN_JOURNAL } from "./const";
import { defaultServerDataConfig } from "./server-data/common/config";
import { CONFIG_KEY_SERVER_DATA } from "./server-data/common/const";
import { defaultChangeTrackerConfig } from "./change-tracker/common/config";
import { CONFIG_KEY_CHANGE_TRACKER } from "./change-tracker/common/const";
import UIUtils from "./utils/ui-utils";
import { JournalLogUtils } from "./utils/log-utils";

/**
 * SZXW“一本账”插件
 */
export default class JournalPlugin extends Plugin {
  static override type = UniverInstanceType.UNIVER_SHEET;
  static override pluginName = PLUGIN_JOURNAL;

  constructor(
    // 插件配置
    _config: null,
    // 可通过this._injector.get(IUniverInstanceService)可以获取对应的服务
    @Inject(Injector) readonly _injector: Injector,
    // 注入配置服务
    @Inject(IConfigService) private readonly _configService: IConfigService,
    // 注入日志服务
    @Inject(ILogService) private readonly _logService: ILogService
  ) {
    _logService.log("[JournalPlugin]", "constructor");
    super();

    // 加载配置
    const { ...serverDataConfig } = merge({}, defaultServerDataConfig, _config);
    this._configService.setConfig(CONFIG_KEY_SERVER_DATA, serverDataConfig);

    const { ...changeTrackerConfig } = merge(
      {},
      defaultChangeTrackerConfig,
      _config
    );
    this._configService.setConfig(
      CONFIG_KEY_CHANGE_TRACKER,
      changeTrackerConfig
    );
  }

  override onStarting(): void {
    this._logService.log("[JournalPlugin]", "onStarting");

    //TODO  在onStarting注册插件的依赖模块，需要注意先后顺序
    ([[JournalLogUtils], [UIUtils]] as Dependency[]).forEach((d) =>
      this._injector.add(d)
    );

    // 模拟首次调用以触发依赖系统调用构造函数
    //TODO 官方源码分别在不同的生命周期函数中touch，原因待考证
    touchDependencies(this._injector, [[JournalLogUtils]]);
  }

  override onReady(): void {
    this._logService.log("[JournalPlugin]", "onReady");
  }

  override onRendered(): void {
    this._logService.log("[JournalPlugin]", "onRendered");
    touchDependencies(this._injector, [[UIUtils]]);
  }

  override onSteady(): void {
    this._logService.log("[JournalPlugin]", "onSteady");
  }
}
