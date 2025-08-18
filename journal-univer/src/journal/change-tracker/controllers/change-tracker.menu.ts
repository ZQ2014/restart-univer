import {
  MenuItemType,
  type IMenuButtonItem,
} from "@univerjs/preset-sheets-core";
import {
  COMPONENT_EXPORT_ICON,
  MENU_BUTTON_UPLOAD_CHANGE_RECORDS,
} from "../common/const";
import { UploadChangeRecordsCommand } from "../commands/commands/change-tracker.command";

export function UploadChangeRecordsButtonFactory(): IMenuButtonItem<string> {
  return {
    // 菜单项的ID。通常它应该与它将调用的命令的ID相同。
    id: MENU_BUTTON_UPLOAD_CHANGE_RECORDS,
    //如果两个菜单重复使用相同的命令（例如复制和粘贴命令），它们应该具有相同的命令id和不同的id。
    commandId: UploadChangeRecordsCommand.id,
    // 菜单项的类型，在本例中，它是一个按钮
    type: MenuItemType.BUTTON,
    // 按钮的图标，需要提前在 ComponentManager 中注册
    // #工具栏：可显示；如设置lebel，则被隐藏
    // #右键菜单：必显示，左数第1位
    icon: COMPONENT_EXPORT_ICON,
    // #工具栏：必显示；会替代icon
    // #右键菜单：必显示，左数第2位
    // label: COMPONENT_HELLO,
    // 按钮的标题，优先匹配国际化，如果没有匹配到，将显示原始字符串
    // #工具栏：必显示，左数第2位
    // #右键菜单：必显示，左数第3位
    title: "保存",
    // 按钮的提示，优先匹配国际化，如果没有匹配到，将显示原始字符串
    // #工具栏：鼠标悬浮时显示
    // #右键菜单：不显示
    tooltip: "将当前页面修改保存到服务器",
  };
}
