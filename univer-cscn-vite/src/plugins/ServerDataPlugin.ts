import type { ICommand, Workbook } from "@univerjs/presets";
import { CloudOutlineIcon } from "@univerjs/icons";
import {
  CommandType,
  ICommandService,
  Inject,
  Injector,
  IUniverInstanceService,
  Plugin,
  UniverInstanceType,
} from "@univerjs/presets";
import {
  ComponentManager,
  IMenuManagerService,
  MenuItemType,
  RibbonStartGroup,
} from "@univerjs/presets/preset-sheets-core";

const CSCN_UPDATE_BUTTON = "cscn.button.update-server-data/template";

/**
 * 更新按键插件
 * 对于普通用户ID，根据用户修改历史更新数据库数据
 * 对于“Template”用户ID，更新基础模板的JSON文件
 */
class ServerDataPlugin extends Plugin {
  static override type = UniverInstanceType.UNIVER_SHEET;
  static override pluginName = CSCN_UPDATE_BUTTON;

  constructor(
    _config: null,
    // 构造函数必须注入的“注入器”
    // 可通过this._injector.get(IUniverInstanceService)可以获取对应的服务
    @Inject(Injector) readonly _injector: Injector,
    // 注入获取当前Univer实例的服务
    @Inject(IUniverInstanceService)
    private readonly univerInstanceService: IUniverInstanceService,
    // 注入菜单服务，用于添加工具栏按键
    @Inject(IMenuManagerService)
    private readonly menuManagerService: IMenuManagerService,
    // 注入命令服务，用于注册命令句柄
    @Inject(ICommandService) private readonly commandService: ICommandService,
    // 注入组件管理器，用于注册图标组件
    @Inject(ComponentManager)
    private readonly componentManager: ComponentManager
  ) {
    super();
    console.log("UpdatePlugin:onStarting");
  }

  override onStarting(): void {
    console.log("UpdatePlugin:onStarting");

    // 注册图标组建
    this.disposeWithMe(
      this.componentManager.register(CSCN_UPDATE_BUTTON, CloudOutlineIcon)
    );

    // 定义保存命令
    const command: ICommand = {
      type: CommandType.OPERATION, // 不会改变快照数据的命令
      id: CSCN_UPDATE_BUTTON, // 命令的唯一ID，在整个程序中必须唯一
      handler: () => this.updateByUserid(), // 执行保存操作的函数
    };

    // 生成菜单项的工厂
    const menuItemFactory = () => ({
      id: CSCN_UPDATE_BUTTON, // 关联按键与图标、命令的依据
      title: "更新",
      tooltip: "更新服务端数据",
      icon: CSCN_UPDATE_BUTTON,
      type: MenuItemType.BUTTON,
    });

    // 添加工具栏按钮
    this.menuManagerService.mergeMenu({
      [RibbonStartGroup.OTHERS]: {
        [CSCN_UPDATE_BUTTON]: {
          order: 10,
          menuItemFactory,
        },
      },
    });

    // 注册保存命令
    this.commandService.registerCommand(command);
  }

  override onReady(): void {
    console.log("UpdatePlugin:onReady");
  }

  override onRendered(): void {
    console.log("UpdatePlugin:onRendered");
  }

  override onSteady(): void {
    console.log("UpdatePlugin:onSteady");
  }

  private async updateByUserid() {
    // 获取当前活动的Sheet类型的工作簿
    const workbook = this.univerInstanceService.getCurrentUnitOfType<Workbook>(
      UniverInstanceType.UNIVER_SHEET
    );

    if (!workbook) {
      console.error("未找到活动的工作簿");
      return false;
    }

    try {
      if

      // 获取工作簿快照
      const snapshot = workbook.getSnapshot();

      // 转换为JSON
      const jsonData = JSON.stringify(snapshot, null, 2);

      // 创建下载
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `workbook-snapshot-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();

      // 清理
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);

      console.log("成功将workshop数据导出为JSON文件");
      return true;
    } catch (error) {
      console.error("将workshop数据导出为JSON文件失败:", error);
      return false;
    }
  }
}

export default ServerDataPlugin;
