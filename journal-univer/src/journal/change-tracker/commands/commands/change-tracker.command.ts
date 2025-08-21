import type { IAccessor, ICommand } from "@univerjs/core";
import { CommandType, ILogService } from "@univerjs/core";
import { OPERATION_UPLOAD_CHANGE_RECORDS_BUTTON } from "../../common/const";

export const ChangeCellStyleByChangeRecordMutation: ICommand = {
  id: MUTATION_CHANGE_CELL_STYLE_BY_CHANGE_RECORD,
  type: CommandType.MUTATION,
  handler: async (accessor: IAccessor, params: any) => {
    const logService = accessor.get(ILogService);
    logService.log("[UploadChangeRecordsButtonOperation]", params);
    //FIXME
    // const sucess = accessor.get(IOfficalDemoService).openSidebar(params);
    return true;
  },
};

export const UploadChangeRecordsButtonOperation: ICommand = {
  id: OPERATION_UPLOAD_CHANGE_RECORDS_BUTTON,
  type: CommandType.OPERATION,
  handler: async (accessor: IAccessor, params: any) => {
    const logService = accessor.get(ILogService);
    logService.log("[UploadChangeRecordsButtonOperation]", params);
    //FIXME
    // const sucess = accessor.get(IOfficalDemoService).openSidebar(params);
    return true;
  },
};

export const UploadChangeRecordOperation: ICommand = {
  id: OPERATION_UPLOAD_CHANGE_RECORDS_BUTTON,
  type: CommandType.COMMAND,
  handler: async (accessor: IAccessor, params: any) => {
    const logService = accessor.get(ILogService);
    logService.log(
      "[SingleButtonOnclickedOperation]",
      "UploadChangeRecordsCommand：",
      params
    );
    //FIXME
    // const sucess = accessor.get(IOfficalDemoService).openSidebar(params);
    return true;
  },
};

/**
 * 官方示例的命令集
 */
export const CHANGE_TRACKER_COMMANDS = new Set([
  UploadChangeRecordsButtonOperation,
]);
