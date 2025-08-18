import {
  IConfirmService,
  IDialogService,
  IMessageService,
  INotificationService,
  ISidebarService,
  type IConfirmPartMethodOptions,
  type ICustomLabelProps,
  type IDialogPartMethodOptions,
  type ISidebarMethodOptions,
} from "@univerjs/preset-sheets-core";
import {
  Disposable,
  Inject,
  Injector,
  MessageType,
  type IDisposable,
  type IToasterProps,
} from "@univerjs/presets";
import type { CSSProperties } from "react";
import { JournalLogUtils } from "./log-utils";

/**
 * 用户交互工具类
 */
export default class UIUtils extends Disposable {
  constructor(
    _config: null,
    // 可通过this._injector.get(IUniverInstanceService)可以获取对应的模块
    @Inject(Injector) readonly _injector: Injector,
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
    // 注入自定义日志服务
    @Inject(JournalLogUtils) private readonly _logService: JournalLogUtils
  ) {
    super();
    this._debug("constructor");
  }

  openSidebarByOpts(
    params: ISidebarMethodOptions,
    duration?: number
  ): IDisposable {
    this._debug("openSidebarByOpts", params);

    const disposable = this._sidebarService.open(params);

    if (!disposable) {
      this._error("openSidebarByOpts", "失败", params);
      return disposable;
    }

    // 延迟关闭
    if (duration) {
      setTimeout(() => {
        this._debug("openSidebarByOpts", "自动延迟关闭", duration, params);
        disposable?.dispose();
      }, duration);
    }
    return disposable;
  }

  /**
   * 打开侧边栏
   * @param id 可选，侧边栏唯一标识符
   * @param header 可选，侧边栏头部自定义组件属性{label:组件ID,title:string}
   * @param children 可选，侧边栏内容区域自定义组件属性{label:组件ID,title:string}
   * @param footer 可选，侧边栏底部自定义组件属性{label:组件ID,title:string}
   * @param width 可选，侧边栏宽度，可以是数字或字符串
   * @param duration 通知持续时间(毫秒)，默认不自动关闭
   * @param bodyStyle 可选，侧边栏内容区域样式
   * @param visible 可选，是否可见
   * @param onClose 可选，侧边栏关闭时的回调函数
   * @returns 返回IDisposable对象，用于关闭侧边栏；失败则反回null
   */
  openSidebar(
    id?: string,
    header?: ICustomLabelProps,
    children?: ICustomLabelProps,
    footer?: ICustomLabelProps,
    width?: number | string,
    duration?: number,
    bodyStyle?: CSSProperties,
    visible?: boolean,
    // onOpen?: () => void,//无效
    onClose?: () => void
  ): IDisposable {
    return this.openSidebarByOpts(
      {
        id,
        header,
        children,
        footer,
        bodyStyle,
        visible,
        width,
        onClose,
      },
      duration
    );
  }

  closeSidebar(id: string) {
    this._debug("closeSidebar", id);
    return this._sidebarService.close(id);
  }

  openDialogByOpts(
    params: IDialogPartMethodOptions,
    duration?: number
  ): IDisposable {
    this._debug("openDialogByOpts", params);
    const disposable = this._dialogService.open(params);

    if (!disposable) {
      this._error("openDialogByOpts", "失败", params);
      return disposable;
    }

    // 延迟关闭
    if (duration) {
      setTimeout(() => {
        this._debug("openDialogByOpts", "自动延迟关闭", duration, params);
        disposable?.dispose();
      }, duration);
    }
    return disposable;
  }

  /**
   * 打开一个对话框
   * @param id 对话框的唯一标识符，必选且全局唯一；
   * @param title 对话框标题配置，可选{label:组件ID,title:string}
   * @param children 对话框内容配置，可选{label:组件ID,title:string}
   * @param footer 对话框底部配置，可选{label:组件ID,title:string}；注意：与默认的确认/取消按键冲突，优先级更高
   * @param duration 对话框自动关闭的延迟时间(毫秒)
   * @param width 对话框宽度，可以是数字或字符串，可选
   * @param defaultPosition 对话框默认位置坐标，{x:number;y:number;}，可选
   * @param style 对话框的CSS样式，可选
   * @param draggable 是否可拖拽，可选，默认false
   * @param mask 是否显示遮罩层，可选，默认true
   * @param maskClosable 点击遮罩层是否可关闭对话框，可选，默认true
   * @param closable 是否显示关闭按钮（“x”），可选，默认true
   * @param open 对话框是否打开状态，可选
   * @param onOpenChange 对话框打开状态变化时的回调函数，可选；拖动、关闭等均可能触发
   * @param onClose 对话框关闭时的回调函数，可选；注意：需手段销毁组件
   * @param showOk 是否显示确定按钮，可选
   * @param showCancel 是否显示取消按钮，可选
   * @param onOk 点击确定按钮时的回调函数，可选；注意：需手段销毁组件，不会调用onClose
   * @param onCancel 点击取消按钮时的回调函数，可选；注意：需手段销毁组件，不会调用onClose
   * @returns 返回一个IDisposable对象，可用于关闭对话框；失败则反回null
   */
  openDialog(
    id: string,
    title?: ICustomLabelProps,
    children?: ICustomLabelProps,
    footer?: ICustomLabelProps,
    duration?: number,
    width?: number | string,
    defaultPosition?: {
      x: number;
      y: number;
    },
    style?: CSSProperties,
    draggable?: boolean,
    mask?: boolean,
    maskClosable?: boolean,
    closable?: boolean,
    // keyboard?: boolean,//无效
    // destroyOnClose?: boolean,//无效
    // preservePositionOnDestroy?: boolean,//没看到啥效果
    open?: boolean,
    onOpenChange?: (open: boolean) => void,
    onClose?: () => void,
    showOk?: boolean,
    showCancel?: boolean,
    onOk?: () => void,
    onCancel?: () => void
  ): IDisposable {
    return this.openDialogByOpts(
      {
        id,
        title,
        children,
        footer,
        width,
        defaultPosition,
        style,
        draggable,
        mask,
        maskClosable,
        closable,
        // keyboard?: boolean,//无效
        // destroyOnClose?: boolean,//无效
        // preservePositionOnDestroy?: boolean,//没看到啥效果
        open,
        onOpenChange,
        onClose,
        showOk,
        showCancel,
        onOk,
        onCancel,
      },
      duration
    );
  }
  /**
   * 打开一个简单对话框
   * @param id 对话框的唯一标识符，必选且全局唯一；
   * @param title 对话框标题配置，可选{label:组件ID,title:string}
   * @param children 对话框内容配置，可选{label:组件ID,title:string}
   * @param width 对话框宽度，可以是数字或字符串，可选
   * @param closable 是否显示关闭按钮（“x”），可选，默认true
   * @param onClose 对话框关闭时的回调函数，可选；注意：需手段销毁组件
   * @param showOk 是否显示确定按钮，可选
   * @param showCancel 是否显示取消按钮，可选
   * @param onOk 点击确定按钮时的回调函数，可选；注意：需手段销毁组件，不会调用onClose
   * @param onCancel 点击取消按钮时的回调函数，可选；注意：需手段销毁组件，不会调用onClose
   * @returns 返回一个IDisposable对象，可用于关闭对话框；失败则反回null
   */
  openSimpleDialog(
    id: string,
    title?: ICustomLabelProps,
    children?: ICustomLabelProps,
    width?: number | string,
    closable?: boolean,
    onClose?: () => void,
    showOk?: boolean,
    showCancel?: boolean,
    onOk?: () => void,
    onCancel?: () => void
  ): IDisposable {
    return this.openDialogByOpts({
      id,
      title,
      children,
      width,
      draggable: false,
      mask: true,
      maskClosable: false,
      closable,
      onClose,
      showOk,
      showCancel,
      onOk,
      onCancel,
    });
  }

  closeDialog(id: string) {
    this._debug("closeConfirm", id);
    return this._dialogService.close(id);
  }

  openConfirmByOpts(
    params: IConfirmPartMethodOptions,
    duration?: number
  ): IDisposable {
    this._debug("openConfirmByOpts", params);
    const disposable = this._confirmService.open(params);

    if (!disposable) {
      this._error("openConfirmByOpts", "失败", params);
      return disposable;
    }

    // 延迟关闭
    if (duration) {
      setTimeout(() => {
        this._debug("openConfirmByOpts", "自动延迟关闭", duration, params);
        disposable?.dispose();
      }, duration);
    }
    return disposable;
  }

  /**
   * 打开一个确认框
   * @param id 确认框的唯一标识符，必选且全局唯一；
   * @param title 确认框标题配置，可选{label:组件ID,title:string}
   * @param children 确认框内容配置，可选{label:组件ID,title:string}
   * @param duration 确认框自动关闭的延迟时间(毫秒)
   * @param width 确认框宽度，可以是数字或字符串，可选
   * @param closable 是否显示关闭按钮（“x”），可选，默认true
   * @param visible 确认框是否打开状态，可选
   * @param confirmText 确定按钮文字，可选
   * @param cancelText 取消按钮文字，可选
   * @param onConfirm 点击确定按钮时的回调函数，可选；注意：需手段销毁组件，不会调用onClose
   * @param onClose 确认框关闭时的回调函数，可选；注意：需手段销毁组件
   * @returns 返回一个IDisposable对象，可用于关闭确认框；失败则反回null
   */
  openConfirm(
    id: string,
    title?: ICustomLabelProps,
    children?: ICustomLabelProps,
    duration?: number,
    width?: number | string,
    visible?: boolean,
    confirmText?: string,
    cancelText?: string,
    onConfirm?: () => void,
    onClose?: () => void
  ): IDisposable {
    return this.openConfirmByOpts(
      {
        id,
        title,
        children,
        width,
        visible,
        confirmText,
        cancelText,
        onConfirm,
        onClose,
      },
      duration
    );
  }

  closeConfirm(id: string) {
    this._debug("closeConfirm", id);
    return this._dialogService.close(id);
  }

  /**
   * 显示通知消息
   * @param title 通知标题
   * @param content 通知内容
   * @param type 通知类型，默认为'info'，可选值为'success' | 'info' （重要！）| 'warning' （警告！）| 'error' （异常！）| 'message' （提示：）| 'loading'
   * @param position 通知显示位置，默认为'bottom-right'，可选值为'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center'
   * @param duration 通知持续时间(毫秒)，默认为3000毫秒
   * @param closable 是否显示关闭按键（“x”），默认为true
   * @param icon
   * @returns 返回一个IDisposable对象；失败则反回null
   */
  showNotification(
    title: string,
    content?: string,
    type?: "success" | "info" | "warning" | "error" | "message" | "loading",
    position?: IToasterProps["position"],
    duration?: number,
    closable?: boolean,
    // expand?: boolean,// 无效
    icon?: React.ReactNode
  ): IDisposable {
    this._debug("showNotification", title);
    const disposable = this._notificationService.show({
      title,
      content,
      type: type || "info",
      position: position || "bottom-right",
      duration: duration || 3000,
      closable: closable || true,
      icon,
    });

    if (!disposable) {
      this._error("showNotification", "失败");
    }
    return disposable;
  }

  /**
   * 显示消息提示
   * @param content 消息内容
   * @param id 消息ID，可选参数
   * @param type 消息类型，可选参数；枚举'success' | 'info' | 'warning' | 'error' | 'loading'
   * @param duration 显示持续时间，可选参数
   * @param onClose 关闭回调函数，可选参数
   * @returns 返回一个可销毁的对象，用于手动关闭消息
   */
  showMessage(
    content: string,
    id?: string,
    type?: MessageType,
    duration?: number,
    onClose?: () => void
  ): IDisposable {
    this._debug("showMessage", content);
    const disposable = this._messageService.show({
      id,
      content,
      type,
      duration,
      onClose,
    });

    if (!disposable) {
      this._error("showMessage", "失败");
    }
    return disposable;
  }

  private _debug(...args: any) {
    this._logService.debug("[UIUtils]", ...args);
  }
  // private _log(...args: any) {
  //   this._logService.log("[UIUtils]", ...args);
  // }

  // private _warn(...args: any) {
  //   this._logService.warn("[UIUtils]", ...args);
  // }

  private _error(...args: any) {
    this._logService.error("[UIUtils]", ...args);
  }

  // private _deprecate(...args: any) {
  //   this._logService.deprecate("[UIUtils]", ...args);
  // }
}
