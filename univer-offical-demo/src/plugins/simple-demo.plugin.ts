import {
  type Dependency,
  IConfigService,
  ILogService,
  Inject,
  Injector,
  LocaleService,
  Plugin,
  UniverInstanceType,
} from "@univerjs/core";
import { merge } from "lodash-es"; // 用于合并配置
import {
  defaultSimpleDemConfig,
  type ISimpleDemoConfig,
} from "../common/config";
import { SIMPLE_DEMO_CONFIG_KEY, PLUGIN_SIMPLE_DEMO } from "../common/const";
import { SimpleDemoService } from "../services/simple-demo.service";
import { SimpleDemoController } from "../controllers/simple-demo.controller";
import enUS from "../locale/en-US";
import zhCN from "../locale/zh-CN";

/**
 * 一个最基本的Plugin示例。
 * Plugin主要用于注册自定义的模块依赖（controller、service等）
 */
export class SimpleDemoPlugin extends Plugin {
  // 声明当前插件对于Sheet适用
  static override type = UniverInstanceType.UNIVER_SHEET;
  // 插件名称需全局唯一，建议使用类似"happyq.功能名称.plugin"的命名方式
  static override pluginName = PLUGIN_SIMPLE_DEMO;

  constructor(
    // 插件配置
    // _config: null,
    private readonly _config: Partial<ISimpleDemoConfig> = defaultSimpleDemConfig,
    // 可通过this._injector.get(IUniverInstanceService)可以获取对应的模块
    @Inject(Injector) readonly _injector: Injector,
    // 注入日志服务
    @Inject(ILogService) private readonly _logService: ILogService,
    // 注入配置服务（可选）
    @Inject(IConfigService) private readonly _configService: IConfigService,
    // 注入国际化服务
    @Inject(LocaleService) private readonly _localeService: LocaleService
  ) {
    super();
    this._logService.log("[SimpleDemoPlugin]", "constructor");

    // 在构造函数中管理插件配置（可选）
    const { ...rest } = merge({}, defaultSimpleDemConfig, this._config);
    this._configService.setConfig(SIMPLE_DEMO_CONFIG_KEY, rest);

    // 加载国际化配置
    this._localeService.load({
      enUS,
      zhCN,
    });
  }

  override onStarting(): void {
    this._logService.log("[SimpleDemoPlugin]", "onStarting");

    // 在onStarting注册插件的依赖项，需要注意先后顺序
    ([[SimpleDemoService], [SimpleDemoController]] as Dependency[]).forEach(
      (d) => this._injector.add(d)
    );

    // @todo 保证模块已经注册，官方源码分别在不同的生命周期函数中touch，原因待考证
    // touchDependencies(this._injector, [[SimpleController], [SimpleService]]);
  }

  override onReady(): void {
    this._logService.log("[SimpleDemoPlugin]", "onReady");
    // touchDependencies(this._injector, [[SimpleController], [SimpleService]]);
  }

  override onRendered(): void {
    this._logService.log("[SimpleDemoPlugin]", "onRendered");
    // touchDependencies(this._injector, [[SimpleController], [SimpleService]]);
  }

  override onSteady(): void {
    this._logService.log("[SimpleDemoPlugin]", "onSteady");
    // touchDependencies(this._injector, [[SimpleController], [SimpleService]]);
  }
}
