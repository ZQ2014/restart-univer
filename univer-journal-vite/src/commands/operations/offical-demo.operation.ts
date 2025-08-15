import type { IAccessor, ICommand } from "@univerjs/core";
import { CommandType, ILogService } from "@univerjs/core";
import {
  OPERATION_CANVAS as OPERATION_DROPDOWN_FIFTH_ONCLICKED,
  OPERATION_DROPDOWN_FIRST_ONCLICKED,
  OPERATION_DROPDOWN_FOURTH_ONCLICKED,
  OPERATION_DROPDOWN_SECOND_ONCLICKED,
  OPERATION_DROPDOWN_SIX_ONCLICKED,
  OPERATION_DROPDOWN_THIRD_ONCLICKED,
  OPERATION_SINGLE_BUTTON_ONCLICKED,
} from "../../common/const";
import IOfficalDemoService from "../../services/offical-demo.service";

export const SingleButtonOnclickedOperation: ICommand = {
  id: OPERATION_SINGLE_BUTTON_ONCLICKED,
  type: CommandType.OPERATION,
  handler: async (accessor: IAccessor, params: any) => {
    // 测试参数
    const logService = accessor.get(ILogService);
    logService.log(
      "[SingleButtonOnclickedOperation]",
      "SingleButton onClicked operation：",
      params
    );

    const sucess = accessor.get(IOfficalDemoService).openSidebar(params);
    logService.log("[SingleButtonOnclickedOperation]", "return：", sucess);
    return sucess;
  },
};

export const DropdownListFirstItemOperation: ICommand = {
  id: OPERATION_DROPDOWN_FIRST_ONCLICKED,
  type: CommandType.OPERATION,
  handler: async (accessor: IAccessor, params: any) => {
    // 测试参数
    const logService = accessor.get(ILogService);
    logService.log(
      "[DropdownListFirstItemOperation]",
      "DropdownList-FirstItem operation：",
      params
    );

    const sucess = accessor.get(IOfficalDemoService).openDialog(params);
    logService.log("[DropdownListFirstItemOperation]", "return：", sucess);
    return sucess;
  },
};

export const DropdownListSecondItemOperation: ICommand = {
  id: OPERATION_DROPDOWN_SECOND_ONCLICKED,
  type: CommandType.OPERATION,
  handler: async (accessor: IAccessor, params: any) => {
    // 测试参数
    const logService = accessor.get(ILogService);
    logService.log(
      "[DropdownListSecondItemOperation]",
      "DropdownList-SecondItem operation：",
      params
    );

    const sucess = accessor.get(IOfficalDemoService).openConfirm(params);
    logService.log("[DropdownListSecondItemOperation]", "return：", sucess);
    return sucess;
  },
};

export const DropdownListThirdItemOperation: ICommand = {
  id: OPERATION_DROPDOWN_THIRD_ONCLICKED,
  type: CommandType.OPERATION,
  handler: async (accessor: IAccessor, params: any) => {
    // 测试参数
    const logService = accessor.get(ILogService);
    logService.log(
      "[DropdownListThirdItemOperation]",
      "DropdownList-ThirdItem operation：",
      params
    );

    const sucess = accessor.get(IOfficalDemoService).showNotification(params);
    logService.log("[DropdownListThirdItemOperation]", "return：", sucess);
    return sucess;
  },
};

export const DropdownListFourthItemOperation: ICommand = {
  id: OPERATION_DROPDOWN_FOURTH_ONCLICKED,
  type: CommandType.OPERATION,
  handler: async (accessor: IAccessor, params: any) => {
    // 测试参数
    const logService = accessor.get(ILogService);
    logService.log(
      "[DropdownListFourthItemOperation]",
      "DropdownList-FourthItem operation：",
      params
    );

    const sucess = accessor.get(IOfficalDemoService).showMessage(params);
    logService.log("[DropdownListFourthItemOperation]", "return：", sucess);
    return sucess;
  },
};

export const DropdownListFifthItemOperation: ICommand = {
  id: OPERATION_DROPDOWN_FIFTH_ONCLICKED,
  type: CommandType.OPERATION,
  handler: async (accessor: IAccessor, params: any) => {
    // 测试参数
    const logService = accessor.get(ILogService);
    logService.log(
      "[DropdownListFifthItemOperation]",
      "DropdownList-FifthItem operation：",
      params
    );

    const sucess = accessor.get(IOfficalDemoService).canvasOperation(params);
    logService.log("[DropdownListFifthItemOperation]", "return：", sucess);
    return sucess;
  },
};

export const DropdownListSixthItemOperation: ICommand = {
  id: OPERATION_DROPDOWN_SIX_ONCLICKED,
  type: CommandType.OPERATION,
  handler: async (accessor: IAccessor, params: any) => {
    // 测试参数
    const logService = accessor.get(ILogService);
    logService.log(
      "[DropdownLisSixthItemOperation]",
      "DropdownList-FifthItem operation：",
      params
    );

    const sucess = accessor
      .get(IOfficalDemoService)
      .showRangeSelectorDialog(params);
    logService.log("[DropdownLisSixthItemOperation]", "return：", sucess);
    return true;
  },
};

/**
 * 官方示例的命令集
 */
export const OFFICAL_DEMO_COMMANDS = new Set([
  SingleButtonOnclickedOperation,
  DropdownListFirstItemOperation,
  DropdownListSecondItemOperation,
  DropdownListThirdItemOperation,
  DropdownListFourthItemOperation,
  DropdownListFifthItemOperation,
  DropdownListSixthItemOperation,
]);
