import type { IMenuButtonItem, IMenuSelectorItem } from "@univerjs/ui";
import { MenuItemType } from "@univerjs/ui";
import {
  DropdownListFifthItemOperation,
  DropdownListFirstItemOperation,
  DropdownListFourthItemOperation,
  DropdownListSecondItemOperation,
  DropdownListSixthItemOperation,
  DropdownListThirdItemOperation,
  SingleButtonOnclickedOperation,
} from "../commands/operations/offical-demo.operation";
import {
  COMPONENT_BUTTON_ICON,
  COMPONENT_HELLO,
  MENU_DROPDOWN_LIST,
  MENU_SINGLE_BUTTON,
} from "../common/const";

/**
 * 单一按键工厂
 * @returns
 */
export function MenuItemButtonFactory(): IMenuButtonItem<string> {
  return {
    // 菜单项的ID。通常它应该与它将调用的命令的ID相同。
    id: MENU_SINGLE_BUTTON,
    //如果两个菜单重复使用相同的命令（例如复制和粘贴命令），它们应该具有相同的命令id和不同的id。
    commandId: SingleButtonOnclickedOperation.id,
    // 菜单项的类型，在本例中，它是一个按钮
    type: MenuItemType.BUTTON,
    // 按钮的图标，需要提前在 ComponentManager 中注册
    // #工具栏：可显示；如设置lebel，则被隐藏
    // #右键菜单：必显示，左数第1位
    icon: COMPONENT_BUTTON_ICON,
    // #工具栏：必显示；会替代icon
    // #右键菜单：必显示，左数第2位
    label: COMPONENT_HELLO,
    // 按钮的标题，优先匹配国际化，如果没有匹配到，将显示原始字符串
    // #工具栏：必显示，左数第2位
    // #右键菜单：必显示，左数第3位
    title: "button.title",
    // 按钮的提示，优先匹配国际化，如果没有匹配到，将显示原始字符串
    // #工具栏：鼠标悬浮时显示
    // #右键菜单：不显示
    tooltip: "officalDemo.singleButton",
    // #工具栏：不显示
    // #右键菜单：不显示
    description: "button.description",
    params: 1,
  };
}

/**
 * 下拉菜单工厂
 * @returns
 */
export function DropdownListMainButtonFactory(): IMenuSelectorItem<string> {
  return {
    // 当 type 为 MenuItemType.SUBITEMS 时，工厂函数作为下拉列表的容器，可以设置任意唯一的id
    id: MENU_DROPDOWN_LIST,
    // 菜单项的类型
    type: MenuItemType.SUBITEMS,
    // 按钮的图标，需要提前在 ComponentManager 中注册
    // #工具栏：必显示，左数第1位
    // #右键菜单：必显示，左数第1位
    icon: COMPONENT_BUTTON_ICON,
    // #工具栏：必显示，左数第2位
    // #右键菜单：必显示，左数第2位
    label: COMPONENT_HELLO,
    // 按钮的标题，优先匹配国际化，如果没有匹配到，将显示原始字符串
    // #工具栏：必显示，左数第3位
    // #右键菜单：必显示，左数第3位
    title: "dropdown.title",
    // 按钮的提示，优先匹配国际化，如果没有匹配到，将显示原始字符串
    // #工具栏：鼠标悬浮时显示
    // #右键菜单：不显示；鼠标悬浮时打开二级列表
    tooltip: "dropdownList.tooltip",
    // #工具栏：不显示
    // #右键菜单：不显示
    description: "dropdownList.description",
    // #工具栏：传参成功
    // #右键菜单：传参失败
    params: 2,
  };
}
export function DropdownListFirstItemFactory(): IMenuButtonItem<string> {
  return {
    // id: MENU_DROPDOWN_FIRST,
    id: DropdownListFirstItemOperation.id,
    // 关联的command
    // #工具栏：该属性不生效，必须使用id与commandId一致
    // #右键菜单：必显示，左数第1位
    commandId: DropdownListFirstItemOperation.id,
    type: MenuItemType.BUTTON,
    // 按钮的图标，需要提前在 ComponentManager 中注册
    // #工具栏：必显示，左数第1位
    // #右键菜单：必显示，左数第1位
    icon: COMPONENT_BUTTON_ICON,
    // #工具栏：不显示
    // #右键菜单：必显示，左数第2位
    label: COMPONENT_HELLO,
    // 按钮的标题，优先匹配国际化，如果没有匹配到，将显示原始字符串
    // #工具栏：必显示，左数第2位
    // #右键菜单：必显示，左数第3位
    title: "firstItem.title",
    // 按钮的提示，优先匹配国际化，如果没有匹配到，将显示原始字符串
    // #工具栏：不显示
    // #右键菜单：不显示
    tooltip: "firstItem.tooltip",
    // #工具栏：不显示
    // #右键菜单：不显示
    description: "firstItem.description",
    // #工具栏：传参失败
    // #右键菜单：传参失败
    params: 3,
  };
}
export function DropdownListSecondItemFactory(): IMenuButtonItem<string> {
  return {
    // id: MENU_DROPDOWN_SECOND,
    id: DropdownListSecondItemOperation.id,
    commandId: DropdownListSecondItemOperation.id,
    type: MenuItemType.BUTTON,
    icon: COMPONENT_BUTTON_ICON,
    label: COMPONENT_HELLO,
    title: "确认框",
    tooltip: "弹出确认框",
    params: 4,
  };
}
export function DropdownListThirdItemFactory(): IMenuButtonItem<string> {
  return {
    id: DropdownListThirdItemOperation.id,
    type: MenuItemType.BUTTON,
    icon: COMPONENT_BUTTON_ICON,
    label: COMPONENT_HELLO,
    title: "通知",
    tooltip: "循环显示不同类型的通知",
  };
}
export function DropdownListFourthItemFactory(): IMenuButtonItem<string> {
  return {
    id: DropdownListFourthItemOperation.id,
    type: MenuItemType.BUTTON,
    icon: COMPONENT_BUTTON_ICON,
    label: COMPONENT_HELLO,
    title: "消息",
    tooltip: "循环显示不同类型的消息",
  };
}
export function DropdownListFifthItemFactory(): IMenuButtonItem<string> {
  return {
    id: DropdownListFifthItemOperation.id,
    type: MenuItemType.BUTTON,
    icon: COMPONENT_BUTTON_ICON,
    label: COMPONENT_HELLO,
    title: "画布",
    tooltip: "测试画布操作",
  };
}
export function DropdownListSixthItemFactory(): IMenuButtonItem<string> {
  return {
    id: DropdownListSixthItemOperation.id,
    type: MenuItemType.BUTTON,
    icon: COMPONENT_BUTTON_ICON,
    label: COMPONENT_HELLO,
    title: "选择器",
    tooltip: "测试选择器弹窗",
  };
}

// @todo 待补充
//  MenuItemType.BUTTON_SELECTOR:
//  MenuItemType.SELECTOR:
