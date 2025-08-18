import type { IAccessor, ICommand } from "@univerjs/core";
import { CommandType, ILogService } from "@univerjs/core";
import { COMMAND_UPLOAD_CHANGE_RECORDS } from "../../common/const";

export const UploadChangeRecordsCommand: ICommand = {
  id: COMMAND_UPLOAD_CHANGE_RECORDS,
  type: CommandType.COMMAND,
  handler: async (accessor: IAccessor, params: any) => {
    const logService = accessor.get(ILogService);
    logService.log(
      "[SingleButtonOnclickedOperation]",
      "UploadChangeRecordsCommand：",
      params
    );
    //TODO
    // const sucess = accessor.get(IOfficalDemoService).openSidebar(params);
    return true;
  },
};

/**
 * 官方示例的命令集
 */
export const CHANGE_TRACKER_COMMANDS = new Set([UploadChangeRecordsCommand]);
