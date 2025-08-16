import {
  Disposable,
  ILogService,
  Inject,
  Injector,
  IUniverInstanceService,
  type IWorkbookData,
} from "@univerjs/presets";

/**
 * 服务器数据服务
 * 根据不同的用户，执行不同的数据操作
 */
export interface IServerDataService {
  /**
   * 获取当前用户的初始化工作簿数据
   * @returns JSON格式数据，发生异常则返回{}
   */
  getInitWorkbookData(): Promise<IWorkbookData>;
  /**
   * 更新操作，作为“更新”按钮的回调函数
   * 对于普通用户ID，根据用户修改历史更新数据库数据
   * 对于“Template”用户ID，更新基础模板的JSON文件
   * @returns 更新是否成功
   */
  update(): Promise<IUpdateResult[]>;
  /**
   * 获取操作类型
   * @returns 操作类型 user | template | null
   */
  getOprationType(): OperationType;
  /**
   * 获取用户ID
   * @returns 用户ID
   */
  getUserId(): string;
}

export enum OperationType {
  user,
  template,
  null,
}
/** @todo 待完善*/
export interface IUpdateParam {
  unitId: string;
  subUnitId: string;
  columnCount: number;
}
export interface IUpdateResult {
  unitId: string;
  subUnitId: string;
  columnCount: number;
  sucess: boolean;
}

/**
 * 获取和更新服务器数据的服务。
 */
export abstract class ServerDataService
  extends Disposable
  implements IServerDataService
{
  // 当前访问用户的类型
  protected readonly _type: OperationType;
  // 是否正在进行更新操作
  protected _isUpdating = false;

  constructor() {
    super();
  }

  constructor(
    _config: null,
    // 可通过this._injector.get(IUniverInstanceService)可以获取对应的服务
    @Inject(Injector) protected readonly _injector: Injector,
    // 注入获取当前Univer实例的服务
    @Inject(IUniverInstanceService)
    protected readonly univerInstanceService: IUniverInstanceService,
    // 注入日志服务
    @ILogService protected readonly _logService: ILogService
  ) {
    super();
    this._userid = window.location.pathname;
    this._logService.log("[ServerDataService]", "constructor", this._userid);
    this._type = this.checkOperationType(this._userid);
  }

  /**
   * 根据用户ID生成具体的IServerDataService实例
   * @param userid 用户ID
   * @returns
   */
  static createServerDataService(userid: string): IServerDataService {
    if ("" === userid) {
      return new NullServerDataService(userid);
    } else if (ServerDataService.UPDATE_TEMPLATE_ID === userid) {
      return new TemplateServerDataService(userid);
    } else {
      return new UserServerDataService(userid);
    }
  }

  private checkOperationType(userid: string): OperationType {
    if ("" === userid) {
      return OperationType.null;
    } else if (ServerDataService.UPDATE_TEMPLATE_ID === userid) {
      return OperationType.template;
    } else {
      return OperationType.user;
    }
  }

  abstract update(): Promise<IUpdateResult[]>;
  async getInitWorkbookData(): Promise<IWorkbookData> {
    try {
      this._logService.log(
        "[ServerDataService]",
        "开始获取当前用户的初始化工作簿数据：" + this._userid
      );

      const response = await fetch(
        ServerDataService.DATA_SERVER_URL + this._userid
      );
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("当前用户的初始化工作簿数据不存在");
        }
        throw new Error(
          `获取当前用户的初始化工作簿数据失败: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      const jsonData = JSON.parse(JSON.stringify(data));
      this._logService.log(
        "[ServerDataService]",
        "取得当前用户的初始化工作簿数据:",
        jsonData
      );

      return jsonData as IWorkbookData;
    } catch (error) {
      this._logService.error(
        "[ServerDataService]",
        "获取当前用户的初始化工作簿数据失败:",
        (error as Error).message,
        (error as Error).stack
      );
      return {} as IWorkbookData;
    }
  }
  getOprationType(): OperationType {
    return this._type;
  }
  getUserId(): string {
    return this._userid;
  }
}

//   async update(): Promise<boolean> {
//     if (ServerDataService.UPDATE_TEMPLATE_ID === this._userid) {
//       this._logService.log("[ServerDataService]", "执行更新模板操作");
//       return await this.updateTemplate();;
//     } else {
//       this._logService.log("[ServerDataService]", "执行更新数据操作");
//       return await this.updateData();;
//     }
//   }

//   /**
//    * 更新基础模板的JSON文件
//    * @param newTemplateJson 新模板的Json数据.
//    * @returns 更新是否成功.
//    */
//   private async updateTemplate(): Promise<boolean> {
// // 获取当前活动的Sheet类型的工作簿
//     const workbook = this.univerInstanceService.getCurrentUnitOfType<Workbook>(
//       UniverInstanceType.UNIVER_SHEET
//     );

//     if (!workbook) {
//       console.error("未找到活动的工作簿");
//       return false;
//     }

//     try {
//       if

//       // 获取工作簿快照
//       const snapshot = workbook.getSnapshot();

//       // 转换为JSON
//       const jsonData = JSON.stringify(snapshot, null, 2);

//       // 创建下载
//       const blob = new Blob([jsonData], { type: "application/json" });
//       const url = URL.createObjectURL(blob);

//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `workbook-snapshot-${Date.now()}.json`;
//       document.body.appendChild(a);
//       a.click();

//       // 清理
//       setTimeout(() => {
//         document.body.removeChild(a);
//         URL.revokeObjectURL(url);
//       }, 100);

//       console.log("成功将workbook数据导出为JSON文件");
//       return true;
//     } catch (error) {
//       console.error("将workbook数据导出为JSON文件失败:", error);
//       return false;
//     }

//     try {
//       if (!newTemplateJson) {
//         console.warn(" 更新基础模板的JSON文件参数异常");
//         return false;
//       }

//       this._logService.log("开始更新基础模板的JSON文件：", newTemplateJson);

//       const response = await fetch(this.DATA_SERVER_URL + UPDATE_TEMPLATE_ID, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newTemplateJson),
//       });

//       if (!response.ok) {
//         throw new Error(`请求失败: ${response.status} ${response.statusText}`);
//       }

//       this._logService.log("更新基础模板的JSON文件成功");
//       return true;
//     } catch (error) {
//       this._logService.error(
//         "更新基础模板的JSON文件失败:",
//         (error as Error).stack
//       );
//       return false;
//     }
//   }
// }
