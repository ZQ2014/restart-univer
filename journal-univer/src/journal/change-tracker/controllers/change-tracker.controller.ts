import {
  Disposable,
  ICommandService,
  ILogService,
  Inject,
  Injector,
} from "@univerjs/presets";
import {
  ComponentManager,
  IMenuManagerService,
} from "@univerjs/presets/preset-sheets-core";
import { CHANGE_TRACKER_COMPONENTS } from "../components/components";

export class ChangeTrackerController extends Disposable {
  constructor(
    _config: null,
    // 可通过this._injector.get(IUniverInstanceService)可以获取对应的服务
    @Inject(Injector) readonly _injector: Injector,
    // 注入组件管理器，用于管理UI组件，这些组件将用于构成Button、Menu、Notification、Dialog、Comfirm等
    @Inject(ComponentManager)
    private readonly _componentManager: ComponentManager,
    // 注入命令服务，用于注册命令，以通知Univer执行特定操作的事件并实现与之对应得执行代码
    @Inject(ICommandService) private readonly _commandService: ICommandService,
    // 注入菜单管理器
    @Inject(IMenuManagerService)
    private readonly _menuManagerService: IMenuManagerService,
    // 注入日志服务
    @Inject(ILogService) private readonly _logService: ILogService
  ) {
    _logService.log("[ChangeTrackerController]", "constructor");
    super();

    this._initComponents();
    this._initCommands();
    this._initMenus();
  }
  _initComponents() {
    CHANGE_TRACKER_COMPONENTS.forEach((value, key) => {
      this._componentManager.register(key, value);
    });
  }
  //TODO
  _initCommands() {
    throw new Error("Method not implemented.");

    // OFFICAL_DEMO_COMMANDS.forEach((c) => {
    //   this.disposeWithMe(this._commandService.registerCommand(c));
    // });
  }
  _initMenus() {
    throw new Error("Method not implemented.");
    // 单一按键示例
    // this._menuManagerService.mergeMenu({
    //   // 顶部开始菜单
    //   [RibbonStartGroup.OTHERS]: {
    //     [MENU_SINGLE_BUTTON]: {
    //       order: 10,
    //       menuItemFactory: MenuItemButtonFactory,
    //       title: "RibbonStartGroup.OTHERS", //实际执行中，未出现
    //     },
    //   },
    //   // 主区域的右键菜单
    //   [ContextMenuPosition.MAIN_AREA]: {
    //     [ContextMenuGroup.OTHERS]: {
    //       [MENU_SINGLE_BUTTON]: {
    //         order: 12,
    //         menuItemFactory: MenuItemButtonFactory,
    //       },
    //     },
    //   },
    // });
  }

  //TODO
  // override onStarting(): void {
  //   console.log("UpdatePlugin:onStarting");

  //   this._injector.add(ServerDataService.createServerDataService("Template"));

  //   // 注册图标组建
  //   this.disposeWithMe(
  //     this.componentManager.register(happyq_UPDATE_BUTTON, CloudOutlineIcon)
  //   );

  //   // 定义保存命令
  //   const command: ICommand = {
  //     type: CommandType.OPERATION, // 不会改变快照数据的命令
  //     id: happyq_UPDATE_BUTTON, // 命令的唯一ID，在整个程序中必须唯一
  //     handler: () => this.updateByUserid(), // 执行保存操作的函数
  //   };

  //   // 生成菜单项的工厂
  //   const menuItemFactory = () => ({
  //     id: happyq_UPDATE_BUTTON, // 关联按键与图标、命令的依据
  //     title: "更新",
  //     tooltip: "更新服务端数据",
  //     icon: happyq_UPDATE_BUTTON,
  //     type: MenuItemType.BUTTON,
  //   });

  //   // 添加工具栏按钮
  //   this.menuManagerService.mergeMenu({
  //     [RibbonStartGroup.OTHERS]: {
  //       [happyq_UPDATE_BUTTON]: {
  //         order: 10,
  //         menuItemFactory,
  //       },
  //     },
  //   });

  //   // 注册保存命令
  //   this.commandService.registerCommand(command);
  // }

  // override onReady(): void {
  //   console.log("UpdatePlugin:onReady");
  // }

  // override onRendered(): void {
  //   console.log("UpdatePlugin:onRendered");
  // }

  // override onSteady(): void {
  //   console.log("UpdatePlugin:onSteady");
  // }

  // private async updateByUserid() {}
}
