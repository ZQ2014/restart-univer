import {
  CanvasFloatDomService,
  ICanvasPopupService,
  IConfirmService,
  IContextMenuService,
  IDialogService,
  IMessageService,
  INotificationService,
  ISidebarService,
  ShortcutPanelService,
  type IConfirmPartMethodOptions,
  type IDialogPartMethodOptions,
  type INotificationOptions,
  type ISidebarMethodOptions,
} from "@univerjs/preset-sheets-core";
import {
  Disposable,
  ILogService,
  Inject,
  Injector,
  IUniverInstanceService,
  MessageType,
  type IMessageProps,
  type IUnitRangeName,
} from "@univerjs/presets";
import {
  COMPONENT_BUTTON_ICON,
  COMPONENT_HELLO,
  COMPONENT_LOADING,
  COMPONENT_POPUP,
  COMPONENT_RANGE_LOADING,
  COMPONENT_RANGE_POPUP,
  CONFIRM_OFFICAL_DEMO,
  DIALOG_OFFICAL_DEMO,
  MESSAGE_OFFICAL_DEMO,
  SIDEBAR_OFFICAL_DEMO,
} from "../common/const";
import { univerAPI } from "../main-univer";

/**
 * 一个最基本的Service示例。
 */
export interface IOfficalDemoService {
  openSidebar(params: any): boolean;
  openDialog(params: any): boolean;
  openConfirm(params: any): boolean;
  showNotification(params: any): boolean;
  showMessage(params: any): boolean;
  canvasOperation(params: any): boolean;
  showRangeSelectorDialog(params: any): Promise<IUnitRangeName[]>;
}

/**
 * 一个最基本的Service实现示例。
 */
export default class OfficalDemoService
  extends Disposable
  implements IOfficalDemoService
{
  // 用于切换按键的不同响应
  private _actionCounter: number = 0;

  /**
   * 侧边栏配置示例
   */
  private readonly _sidebarOptions: ISidebarMethodOptions = {
    // The unique identifier for the sidebar
    id: SIDEBAR_OFFICAL_DEMO,
    width: 360,
    // style: CSSProperties,
    header: { title: "header.title", label: COMPONENT_HELLO },
    children: { title: "children.title", label: COMPONENT_LOADING },
    footer: {
      title: "footer.title",
      label: COMPONENT_RANGE_LOADING,
    },
    onOpen: () => {
      // 未被调用
      this._logService.log("[OfficalDemoService]", "Sidebar", "onOpen");
    },
    onClose: () => {
      this._logService.log("[OfficalDemoService]", "Sidebar", "onClose");
    },
  };

  /**
   * 对话框配置示例
   */
  private readonly _dialogOpations: IDialogPartMethodOptions = {
    // The unique identifier for the dialog
    id: DIALOG_OFFICAL_DEMO,

    title: { title: "header.title", label: COMPONENT_HELLO },
    children: { title: "children.title", label: COMPONENT_LOADING },
    // footer与默认的确认/取消按键冲突，优先级更高
    // footer: {
    //   title: "footer.title",
    //   label: COMPONENT_RANGE_LOADING,
    // },

    width: 300,
    // style: CSSProperties,
    // defaultPosition: {
    //   x: 10,
    //   y: 10,
    // },

    // draggable: true, // 是否允许拖动，默认false
    // mask: false, // 是否有蒙板，默认true
    // maskClosable: false, // 点击蒙板是否关闭，默认true

    // closable: false, // 是否显示“x”按键，默认true
    // keyboard: false, // ESC关闭，无效
    // destroyOnClose: true, // 无效
    // preservePositionOnDestroy: true, // 没看到啥效果

    onOpenChange: (open: boolean) => {
      this._logService.log(
        "[OfficalDemoService]",
        "dialog",
        "onOpenChange",
        open
      );
    },
    onClose: () => {
      this._logService.log("[OfficalDemoService]", "dialog", "onClose");
      // 使用IDialogService.open打开的dialog，必须添加此句，否则无法关闭
      this._dialogService.close(DIALOG_OFFICAL_DEMO);
    },
    showOk: true, // 默认false
    showCancel: true, // 默认false
    onOk: () => {
      this._logService.log("[OfficalDemoService]", "dialog", "onOk");
      // 使用IDialogService.open打开的dialog，必须添加此句，否则无法关闭
      this._dialogService.close(DIALOG_OFFICAL_DEMO);
    },
    onCancel: () => {
      this._logService.log("[OfficalDemoService]", "dialog", "onCancel");
      // 使用IDialogService.open打开的dialog，必须添加此句，否则无法关闭
      this._dialogService.close(DIALOG_OFFICAL_DEMO);
    },
  };

  /**
   * 确认框配置示例
   */
  private readonly _confirmOpations: IConfirmPartMethodOptions = {
    // The unique identifier for the confirm
    id: CONFIRM_OFFICAL_DEMO,

    title: { title: "header.title", label: COMPONENT_HELLO },
    children: { title: "children.title", label: COMPONENT_LOADING },

    width: 300,

    cancelText: "取消",
    confirmText: "确定",

    onConfirm: (result?: Record<string, any>) => {
      // @todo 不知道如何传参
      this._logService.log(
        "[OfficalDemoService]",
        "confirm",
        "onConfirm",
        result
      );
      // 必须添加此句，否则无法关闭
      this._confirmService.close(CONFIRM_OFFICAL_DEMO);
    },
    onClose: (result?: Record<string, any>) => {
      // @todo 不知道如何传参
      this._logService.log(
        "[OfficalDemoService]",
        "confirm",
        "onClose",
        result
      );
      // 必须添加此句，否则无法关闭
      this._confirmService.close(CONFIRM_OFFICAL_DEMO);
    },
  };

  /**
   * 通知配置示例
   */
  private readonly _notificationOpations: INotificationOptions = {
    title: "notification.title",
    content: "notification.content",
    /** 'success' | 'info' | 'warning' | 'error' | 'message' | 'loading' */
    type: "success",
    /** 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center' */
    position: "top-right",
    /** 持续时间 */
    duration: 2000, // 毫秒
    // expand: true, // 无效
    // icon?: React.ReactNode;
    closable: false, // 默认true
  };

  /**
   * 消息配置示例
   */
  private readonly _messageProps: IMessageProps = {
    id: MESSAGE_OFFICAL_DEMO,
    content: "message.content",
    /** 'success' | 'info' | 'warning' | 'error' | 'loading' */
    type: MessageType.Success,
    /** 持续时间 */
    duration: 5000, // 毫秒
    onClose: () => {
      // 没被调用
      this._logService.log("[OfficalDemoService]", "message", "onClose");
    },
  };

  constructor(
    _config: null,
    // 可通过this._injector.get(IUniverInstanceService)可以获取对应的模块
    @Inject(Injector) readonly _injector: Injector,
    // 注入日志服务
    @ILogService private readonly _logService: ILogService,

    // 注入获取当前Univer实例的服务，用于管理工作簿并与之交互
    @Inject(IUniverInstanceService)
    private readonly _univerInstanceService: IUniverInstanceService,
    // 注入对话框服务
    @Inject(IDialogService)
    private readonly _dialogService: IDialogService,
    // 注入确认框服务
    @Inject(IConfirmService)
    private readonly _confirmService: IConfirmService,
    // 注入侧边栏服务
    @Inject(ISidebarService)
    private readonly _sidebarService: ISidebarService,
    // 注入通知服务
    @Inject(INotificationService)
    private readonly _notificationService: INotificationService,
    // 注入消息服务
    @Inject(IMessageService)
    private readonly _messageService: IMessageService,
    // @todo
    // 注入控制右键菜单的服务
    @Inject(IContextMenuService)
    private readonly _contextMenuService: IContextMenuService,
    // 注入快捷面板服务
    @Inject(ShortcutPanelService)
    private readonly _shortcutPanelService: ShortcutPanelService,
    // 注入画布弹出窗口服务
    @Inject(ICanvasPopupService)
    private readonly _ICanvasPopupService: ICanvasPopupService,
    // 注入画布浮动域服务
    @Inject(CanvasFloatDomService)
    private readonly _CanvasFloatDomService: CanvasFloatDomService
  ) {
    super();
    this._logService.log("[OfficalDemoService]", "constructor");
  }

  openSidebar(params: any): boolean {
    this._logService.log(
      "[OfficalDemoService]",
      "openSidebar",
      params,
      this._actionCounter
    );

    let sidebar = null;

    switch (this._actionCounter % 2) {
      case 0:
        sidebar = this._sidebarService.open(this._sidebarOptions);
        break;
      case 1:
        sidebar = univerAPI.openSidebar(this._sidebarOptions);
        break;
      default:
        this._logService.warn(
          "[OfficalDemoService]",
          "未定义的活动类型：",
          this._actionCounter % 2
        );
        break;
    }

    // // 3秒后关闭
    // setTimeout(() => {
    //   this._logService.log("[OfficalDemoService]", "关闭Sidebar", sidebar);
    //   sidebar?.dispose();
    // }, 3000);

    this._actionCounter++;
    return null !== sidebar;
  }

  openDialog(params: any): boolean {
    this._logService.log(
      "[OfficalDemoService]",
      "openDialog",
      params,
      this._actionCounter
    );

    let dialog = null;

    switch (this._actionCounter % 2) {
      case 0:
        dialog = this._dialogService.open(this._dialogOpations);
        break;
      case 1:
        // 会重载onclose函数调用dispose()，所以原本定义的onclose会失效
        dialog = univerAPI.openDialog(this._dialogOpations);
        break;
      default:
        this._logService.warn(
          "[OfficalDemoService]",
          "未定义的活动类型：",
          this._actionCounter % 2
        );
        break;
    }

    // // 3秒后关闭
    // setTimeout(() => {
    //   this._logService.log("[OfficalDemoService]", "关闭Sidebar", dialog);
    //   // dialog?.dispose(); // 不会触发onclose
    //   this._dialogService.close(DIALOG_OFFICAL_DEMO);
    // }, 3000);

    this._actionCounter++;
    return null !== dialog;
  }

  openConfirm(params: any): boolean {
    this._logService.log(
      "[OfficalDemoService]",
      "openConfirm",
      params,
      this._actionCounter
    );

    let confirm = this._confirmService.open(this._confirmOpations);

    // 没有以下函数
    // confirm = univerAPI.openConfirm(this._confirmOptions);

    // // 3秒后关闭
    // setTimeout(() => {
    //   this._logService.log("[OfficalDemoService]", "关闭Sidebar", confirm);
    //   // confirm?.dispose();
    //   // this._confirmService.close(CONFIRM_OFFICAL_DEMO);

    //   // 似乎无效
    //   // this._confirmService.confirm(this._confirmOpations);
    // }, 3000);

    this._actionCounter++;
    return null !== confirm;
  }

  showNotification(params: any): boolean {
    this._logService.log(
      "[OfficalDemoService]",
      "showNotification",
      params,
      this._actionCounter
    );

    let opts = this._notificationOpations;
    switch (this._actionCounter % 5) {
      case 0:
        opts.position = "top-left";
        opts.type = "success";
        break;
      case 1:
        opts.position = "bottom-left";
        opts.type = "info";
        break;
      case 2:
        opts.position = "bottom-right";
        opts.type = "warning";
        break;
      case 3:
        opts.position = "top-center";
        opts.type = "error";
        break;
      case 4:
        opts.position = "bottom-center";
        opts.type = "message";
        break;
      default:
        break;
    }

    let notification = this._notificationService.show(opts);

    this._actionCounter++;
    return null !== notification;
  }

  showMessage(params: any): boolean {
    this._logService.log(
      "[OfficalDemoService]",
      "showMessage",
      params,
      this._actionCounter
    );

    let opts = this._messageProps;
    switch (this._actionCounter % 4) {
      case 0:
        opts.type = MessageType.Error;
        break;
      case 1:
        opts.type = MessageType.Warning;
        break;
      case 2:
        opts.type = MessageType.Info;
        break;
      case 3:
        opts.type = MessageType.Loading;
        break;
      default:
        break;
    }

    let message = this._messageService.show(opts);
    // let message = univerAPI.showMessage(opts);

    // // 1秒后关闭
    // setTimeout(() => {
    //   this._logService.log("[OfficalDemoService]", "关闭message", message);
    //   // 无效
    //   // this._messageService.remove(MESSAGE_OFFICAL_DEMO);
    //   // this._messageService.removeAll();
    // }, 1000);

    this._actionCounter++;
    return null !== message;
  }

  canvasOperation(params: any): boolean {
    this._logService.log(
      "[OfficalDemoService]",
      "canvasOperation",
      params,
      this._actionCounter
    );

    const fWorkbook = univerAPI.getActiveWorkbook();
    if (!fWorkbook) {
      this._logService.warn("No active workbook found");
      return false;
    }
    const fWorksheet = fWorkbook.getActiveSheet();
    const fRange = fWorksheet.getRange("b5:g9");
    let disposable = null;
    switch (this._actionCounter % 6) {
      case 0:
        disposable = fRange.attachPopup({
          componentKey: COMPONENT_POPUP,
        });
        break;
      case 1:
        disposable = fRange.attachAlertPopup({
          title: "Warning",
          message: "This is an warning message",
          type: 1,
          width: 10,
          height: 5,
          key: COMPONENT_BUTTON_ICON,
        });
        break;
      case 2:
        disposable = fRange.attachRangePopup({
          componentKey: COMPONENT_RANGE_POPUP,
          direction: "horizontal", // 'vertical' | 'horizontal' | 'top' | 'right' | 'left' | 'bottom' | 'bottom-center' | 'top-center'
        });
        break;
      case 3:
        disposable = fRange.highlight();
        break;
      case 4:
        const primaryCell = fWorksheet.getRange("a2").getRange();
        disposable = fRange.highlight(
          {
            stroke: "red",
            fill: "yellow",
          },
          {
            ...primaryCell,
            actualRow: primaryCell.startRow,
            actualColumn: primaryCell.startColumn,
            isMerged: true,
            isMergedMainCell: true,
          }
        );
        break;
      // case 5:
      //   disposable = this._ICanvasPopupService.addPopup({
      //     anchorRect$,
      //     componentKey: COMPONENT_POPUP,
      //     unitId: fRange.getUnitId(),
      //     subUnitId: fRange.getSheetId(),
      //     canvasElement:{},
      //   });
      //   // this._CanvasFloatDomService.addFloatDom();
      //   break;
      case 5:
        // 报错
        disposable = fRange.showDropdown({
          location: {
            workbook: fWorkbook.getWorkbook(),
            worksheet: fWorksheet.getSheet(),
            unitId: fRange.getUnitId(),
            subUnitId: fRange.getSheetId(),
            row: 10,
            col: 10,
          },
          type: "list",
          props: {
            options: [
              { label: "Option 1", value: "option1" },
              { label: "Option 2", value: "option2" },
            ],
          },
        });
        break;
      default:
        break;
    }

    setTimeout(() => {
      disposable?.dispose();
    }, 2000);

    this._actionCounter++;
    return null == disposable;

    // const workbook = this._univerInstanceService.getCurrentUnitOfType<Workbook>(
    //   UniverInstanceType.UNIVER_SHEET
    // );
    // if (!workbook) {
    //   this._logService.warn("No active workbook found");
    //   return false;
    // }
    // const worksheet = workbook.getActiveSheet();
    // const range = worksheet.getRange(1, 1, 3, 3);
  }

  async showRangeSelectorDialog(params: any): Promise<IUnitRangeName[]> {
    this._logService.log(
      "[OfficalDemoService]",
      "showRangeSelectorDialog",
      params,
      this._actionCounter
    );

    const fWorkbook = univerAPI.getActiveWorkbook();
    if (null === fWorkbook) {
      throw new Error("获取工作簿失败");
    }
    const fWorksheet = fWorkbook.getActiveSheet();
    const unitId = fWorkbook.getId();

    const result = await univerAPI.showRangeSelectorDialog({
      unitId,
      subUnitId: fWorksheet.getSheetId(),
      initialValue: [
        {
          unitId,
          sheetName: fWorksheet.getSheetName(),
          range: fWorksheet.getRange("A1:B2").getRange(),
        },
      ],
      maxRangeCount: 2,
      supportAcrossSheet: true,
      callback: (ranges: IUnitRangeName[]) => {
        this._logService.log(
          "[OfficalDemoService]",
          "showRangeSelectorDialog",
          "callback",
          ranges.length
        );
      },
    });
    return result;
  }
}
