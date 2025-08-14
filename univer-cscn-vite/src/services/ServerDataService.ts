import {
  Disposable,
  ILogService,
  Inject,
  Injector,
  IUniverInstanceService,
  type IWorkbookData,
} from "@univerjs/presets";

/** @todo 待完善*/
export interface IUpdateParam {
  unitId: string;
  subUnitId: string;
  columnCount: number;
}

/**
 * 获取和更新服务器数据的服务。
 */
export class ServerDataService extends Disposable {
  // static WORKBOOK_DATA: Partial<IWorkbookData> = {};

  // 数据服务器的URL
  private static readonly DATA_SERVER_URL = "/api/happyq/data";
  // 更新模板的userid
  private static readonly UPDATE_TEMPLATE_ID = "Template";
  // 当前访问的用户
  private readonly _userid: string;
  // 是否正在进行更新操作
  private _isUpdating = false;
  // 用户已经修改但是没有保存的数据集
  private _editRecordMap = new Map<string, IUpdateParam>();
  // 正在更新的数据集，用于显示是否更新成功及再次更新
  private _updateRecordMap = new Map<string, IUpdateParam>();

  constructor(
    _config: null,
    // 构造函数必须注入的“注入器”
    // 可通过this._injector.get(IUniverInstanceService)可以获取对应的服务
    @Inject(Injector) readonly _injector: Injector,
    // 注入获取当前Univer实例的服务
    @Inject(IUniverInstanceService)
    private readonly univerInstanceService: IUniverInstanceService,
    // 注入日志服务
    @ILogService private readonly _logService: ILogService
  ) {
    super();
    this._userid = window.location.pathname;
    this._logService.log("[ServerDataService]", "constructor", this._userid);
  }

  /**
   * 获取当前用户的初始化工作簿数据，发生异常则返回{}
   * @returns 当前用户的初始化工作簿JSON格式数据.
   */
  async getInitWorkbookData(): Promise<IWorkbookData> {
    try {
      // 获取用户数据
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
        (error as Error).stack
      );
      return {} as IWorkbookData;
    }
  }

  /**
   * 更新操作，作为“更新”按钮的回调函数
   * 对于普通用户ID，根据用户修改历史更新数据库数据
   * 对于“Template”用户ID，更新基础模板的JSON文件
   * @returns 更新是否成功
   */
  async update(): Promise<boolean> {
    if (ServerDataService.UPDATE_TEMPLATE_ID === this._userid) {
      this._logService.log("[ServerDataService]", "执行更新模板操作");
      return await this.updateTemplate();;
    } else {
      this._logService.log("[ServerDataService]", "执行更新数据操作");
      return await this.updateData();;
    }
  }

  /**
   * 根据用户的修改记录，更新服务端数据
   * @returns 更新是否成功
   */
   async updateData(): Promise<boolean> {
    try {
      if (this._isUpdating) {
        this._logService.warn("[ServerDataService]", "正在进行更新操作，请稍后再试");
        //@todo: 需要在UI上提示用户
        return false;
      }
      
      if (this._editRecordMap.size === 0) {
        this._logService.warn("[ServerDataService]", "没有需要更新的数据");
        //@todo: 需要在UI上提示用户
        return false;
      }

      this._isUpdating = true; 
      const map = this._updateRecordMap;
      this._updateRecordMap = this._editRecordMap
      this._editRecordMap = map; 
      this._editRecordMap.clear();
      const data = JSON.stringify(this._updateRecordMap);

      this._logService.log("[ServerDataService]",`[${this._userid}]更新数据内容: ${data}`);

      const response = await fetch(ServerDataService.DATA_SERVER_URL + this._userid, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      });

      if (!response.ok) {
        throw new Error(`请求失败: ${response.status} ${response.statusText}`);
      }

      this._logService.log("[ServerDataService]","更新当前用户的工作簿数据成功");
      return true;
    } catch (error) {
      this._logService.error("[ServerDataService]",
        "更新当前用户的工作簿数据失败:",
        (error as Error).stack
      );
      return false;
    }
  }

  /**
   * 更新基础模板的JSON文件
   * @param newTemplateJson 新模板的Json数据.
   * @returns 更新是否成功.
   */
  private async updateTemplate(): Promise<boolean> {
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

      console.log("成功将workbook数据导出为JSON文件");
      return true;
    } catch (error) {
      console.error("将workbook数据导出为JSON文件失败:", error);
      return false;
    }


    try {
      if (!newTemplateJson) {
        console.warn(" 更新基础模板的JSON文件参数异常");
        return false;
      }

      this._logService.log("开始更新基础模板的JSON文件：", newTemplateJson);

      const response = await fetch(this.DATA_SERVER_URL + UPDATE_TEMPLATE_ID, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTemplateJson),
      });

      if (!response.ok) {
        throw new Error(`请求失败: ${response.status} ${response.statusText}`);
      }

      this._logService.log("更新基础模板的JSON文件成功");
      return true;
    } catch (error) {
      this._logService.error(
        "更新基础模板的JSON文件失败:",
        (error as Error).stack
      );
      return false;
    }
  }
}
