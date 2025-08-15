import { type IWorkbookData } from "@univerjs/presets";
import {
  type IServerDataService,
  type IUpdateResult,
  OperationType,
  ServerDataService,
} from "./server-data.service";

export class UserServerDataService
  extends ServerDataService
  implements IServerDataService
{
  constructor(private readonly _userid: string) {
    super();
  }

  async update(): Promise<IUpdateResult[]> {
    //   /**
    //    * 根据用户的修改记录，更新服务端数据
    //    * @returns 更新是否成功
    //    */
    //    async updateData(): Promise<boolean> {
    //     try {
    //       if (this._isUpdating) {
    //         this._logService.warn("[ServerDataService]", "正在进行更新操作，请稍后再试");
    //         //@todo: 需要在UI上提示用户
    //         return false;
    //       }

    //       if (this._editRecordMap.size === 0) {
    //         this._logService.warn("[ServerDataService]", "没有需要更新的数据");
    //         //@todo: 需要在UI上提示用户
    //         return false;
    //       }

    //       this._isUpdating = true;
    //       const map = this._updateRecordMap;
    //       this._updateRecordMap = this._editRecordMap
    //       this._editRecordMap = map;
    //       this._editRecordMap.clear();
    //       const data = JSON.stringify(this._updateRecordMap);

    //       this._logService.log("[ServerDataService]",`[${this._userid}]更新数据内容: ${data}`);

    //       const response = await fetch(ServerDataService.DATA_SERVER_URL + this._userid, {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: data,
    //       });

    //       if (!response.ok) {
    //         throw new Error(`请求失败: ${response.status} ${response.statusText}`);
    //       }

    //       this._logService.log("[ServerDataService]","更新当前用户的工作簿数据成功");
    //       return true;
    //     } catch (error) {
    //       this._logService.error("[ServerDataService]",
    //         "更新当前用户的工作簿数据失败:",
    //         (error as Error).stack
    //       );
    //       return false;
    //     }
    //   }
    return [];
  }
}
