import {
  ComponentManager,
  ContextMenuGroup,
  ContextMenuPosition,
  IMenuManagerService,
  IShortcutService,
  RibbonStartGroup,
} from "@univerjs/preset-sheets-core";
import {
  Disposable,
  ICommandService,
  ILogService,
  Inject,
  Injector,
} from "@univerjs/presets";
import { OFFICAL_DEMO_COMMANDS } from "../commands/operations/offical-demo.operation";
import {
  MENU_DROPDOWN_FIFTH,
  MENU_DROPDOWN_FIRST,
  MENU_DROPDOWN_FOURTH,
  MENU_DROPDOWN_LIST,
  MENU_DROPDOWN_SECOND,
  MENU_DROPDOWN_SIXTH,
  MENU_DROPDOWN_THIRD,
  MENU_SINGLE_BUTTON,
  OFFICAL_DEMO_COMPONENTS,
} from "../common/const";
import {
  DropdownListFifthItemFactory,
  DropdownListFirstItemFactory,
  DropdownListFourthItemFactory,
  DropdownListMainButtonFactory,
  DropdownListSecondItemFactory,
  DropdownListSixthItemFactory,
  DropdownListThirdItemFactory,
  MenuItemButtonFactory,
} from "./official-demo-menus";

/**
 * 一个最基本的Controller示例。
 */
export class OfficalDemoController extends Disposable {
  constructor(
    _config: null,
    // 可通过this._injector.get(IUniverInstanceService)可以获取对应的模块
    @Inject(Injector) readonly _injector: Injector,
    // 注入日志服务
    @ILogService private readonly _logService: ILogService,

    // 注入命令服务，用于注册命令，以通知Univer执行特定操作的事件并实现与之对应得执行代码
    @Inject(ICommandService) private readonly _commandService: ICommandService,
    // 注入组件管理器，用于管理UI组件，这些组件将用于构成Button、Menu、Notification、Dialog、Comfirm等
    @Inject(ComponentManager)
    private readonly _componentManager: ComponentManager,
    // 注入菜单管理器
    @Inject(IMenuManagerService)
    private readonly _menuManagerService: IMenuManagerService,
    //TODO
    // 注入快捷键服务
    @Inject(IShortcutService)
    private readonly _shortcutService: IShortcutService
  ) {
    super();
    this._logService.log("[OfficalDemoController]", "constructor");

    this._initComponents();
    this._initCommands();
    this._initMenus();
    // this._initContextMenus();
    // this._initShortcuts();
    // this._initShortcutPanels();
    // this._initSidebar();
  }

  private _initComponents(): void {
    this._logService.log("[OfficalDemoController]", "_initConponents");

    OFFICAL_DEMO_COMPONENTS.forEach((value, key) => {
      this._componentManager.register(key, value);
    });
  }

  private _initCommands() {
    this._logService.log("[OfficalDemoController]", "_initCommands");

    OFFICAL_DEMO_COMMANDS.forEach((c) => {
      this.disposeWithMe(this._commandService.registerCommand(c));
    });
  }

  private _initMenus() {
    this._logService.log("[OfficalDemoController]", "_initMenus");

    // 单一按键示例
    this._menuManagerService.mergeMenu({
      // 顶部开始菜单
      [RibbonStartGroup.OTHERS]: {
        [MENU_SINGLE_BUTTON]: {
          order: 10,
          menuItemFactory: MenuItemButtonFactory,
          title: "RibbonStartGroup.OTHERS", //实际执行中，未出现
        },
      },
      // 主区域的右键菜单
      [ContextMenuPosition.MAIN_AREA]: {
        [ContextMenuGroup.OTHERS]: {
          [MENU_SINGLE_BUTTON]: {
            order: 12,
            menuItemFactory: MenuItemButtonFactory,
          },
        },
      },
    });

    // 下拉菜单示例
    this._menuManagerService.mergeMenu({
      // 顶部开始菜单
      [RibbonStartGroup.OTHERS]: {
        [MENU_DROPDOWN_LIST]: {
          order: 11,
          menuItemFactory: DropdownListMainButtonFactory,
          [MENU_DROPDOWN_FIRST]: {
            order: 0,
            menuItemFactory: DropdownListFirstItemFactory,
          },
          [MENU_DROPDOWN_SECOND]: {
            order: 1,
            menuItemFactory: DropdownListSecondItemFactory,
          },
          [MENU_DROPDOWN_THIRD]: {
            order: 2,
            menuItemFactory: DropdownListThirdItemFactory,
          },
          [MENU_DROPDOWN_FOURTH]: {
            order: 3,
            menuItemFactory: DropdownListFourthItemFactory,
          },
          [MENU_DROPDOWN_FIFTH]: {
            order: 4,
            menuItemFactory: DropdownListFifthItemFactory,
          },
          [MENU_DROPDOWN_SIXTH]: {
            order: 5,
            menuItemFactory: DropdownListSixthItemFactory,
          },
        },
      },
      // 主区域的右键菜单
      [ContextMenuPosition.MAIN_AREA]: {
        [ContextMenuGroup.OTHERS]: {
          [MENU_DROPDOWN_LIST]: {
            order: 9,
            menuItemFactory: DropdownListMainButtonFactory,
            // 以下可以省略，因为与工具栏用了相同的ID
            // [MENU_DROPDOWN_FIRST]: {
            //   order: 0,
            //   menuItemFactory: DropdownListFirstItemFactory,
            // },
            // [MENU_DROPDOWN_SECOND]: {
            //   order: 1,
            //   menuItemFactory: DropdownListSecondItemFactory,
            // },
            // [MENU_DROPDOWN_THIRD]: {
            //   order: 2,
            //   menuItemFactory: DropdownListThirdItemFactory,
            // },
            // [MENU_DROPDOWN_FOURTH]: {
            //   order: 3,
            //   menuItemFactory: DropdownListFourthItemFactory,
            // },
          },
        },
      },
    });
  }
  private _initShortcuts() {
    this._logService.log("[OfficalDemoController]", "_initShortcuts");
    throw new Error("Method not implemented.");
  }
}
