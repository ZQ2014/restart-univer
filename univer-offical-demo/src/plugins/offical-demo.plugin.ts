import {
  ILogService,
  Inject,
  Injector,
  LocaleService,
  Plugin,
  touchDependencies,
  UniverInstanceType,
  type Dependency,
} from "@univerjs/core";
import IOfficalDemoService from "../services/offical-demo.service";
import { OfficalDemoController } from "../controllers/offical-demo.controller";
import { PLUGIN_UNIVER_OFFICAL_DEMO } from "../common/const";
import enUS from "../locale/en-US";
import zhCN from "../locale/zh-CN";

/**
 * 根据官方文档，整理的一些基础用法示例
 */
export class OfficalDemoPlugin extends Plugin {
  // 声明当前插件对于Sheet适用
  static override type = UniverInstanceType.UNIVER_SHEET;
  static override pluginName = PLUGIN_UNIVER_OFFICAL_DEMO;

  // @todo 待学习的官方模块
  // [ThemeSwitcherService],
  // [ZIndexManager],
  // [IUIPartsService, { useClass: UIPartsService }],
  // [ILayoutService, { useClass: DesktopLayoutService }],
  // [IPlatformService, { useClass: PlatformService }],
  // [IClipboardInterfaceService, { useClass: BrowserClipboardService, lazy: true }],
  // [IGalleryService, { useClass: DesktopGalleryService, lazy: true }],
  // [IZenZoneService, { useClass: DesktopZenZoneService, lazy: true }],
  // [IGlobalZoneService, { useClass: DesktopGlobalZoneService, lazy: true }],
  // *[ILocalStorageService, { useClass: DesktopLocalStorageService, lazy: true }],
  // [IBeforeCloseService, { useClass: DesktopBeforeCloseService }],
  // *[ILocalFileService, { useClass: DesktopLocalFileService }],
  // [IUIController, {
  //     useFactory: (injector: Injector) => injector.createInstance(DesktopUIController, this._config),
  //     deps: [Injector],
  // }],
  // [SharedController],
  // [ErrorController],

  constructor(
    _config: null,
    // 可通过this._injector.get(IUniverInstanceService)可以获取对应的模块
    @Inject(Injector) readonly _injector: Injector,
    // 注入日志服务
    @ILogService private readonly _logService: ILogService,
    // 注入国际化服务
    @Inject(LocaleService) private readonly _localeService: LocaleService
  ) {
    super();
    this._logService.log("[OfficalDemoPlugin]", "constructor");

    this._localeService.load({
      enUS,
      zhCN,
    });
  }

  override onStarting(): void {
    this._logService.log("[OfficalDemoPlugin]", "onStarting");

    // 在onStarting注册插件的依赖项，需要注意先后顺序
    ([[IOfficalDemoService], [OfficalDemoController]] as Dependency[]).forEach(
      (d) => this._injector.add(d)
    );
  }

  override onReady(): void {
    this._logService.log("[OfficalDemoPlugin]", "onReady");
  }

  override onRendered(): void {
    this._logService.log("[OfficalDemoPlugin]", "onRendered");

    // 实现会尝试Get一次，似乎会吃掉一个warn，因为连续touch两次只会有一次warn
    touchDependencies(this._injector, [[OfficalDemoController]]);
  }

  override onSteady(): void {
    this._logService.log("[OfficalDemoPlugin]", "onSteady");
    touchDependencies(this._injector, [[IOfficalDemoService]]);
  }
}
