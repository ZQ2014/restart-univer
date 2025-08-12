import type { IWorkbookData } from "@univerjs/presets";

export const UPDATE_TEMPLATE_ID = "Template";

/** @todo 待完善*/
export interface IUpdateParams {
  unitId: string;
  subUnitId: string;
  columnCount: number;
}

/**
 * 获取和更新服务器数据的服务。
 */
export class ServerDataService {
  // static WORKBOOK_DATA: Partial<IWorkbookData> = {};

  // 数据服务器的URL
  static readonly DATA_SERVER_URL = "/api/cscn/data";

  /**
   * 根据URL，获取当前用户的初始化工作簿数据
   * @returns 当前用户的初始化工作簿JSON格式数据.
   */
  public static async getInitWorkbookData(): Promise<IWorkbookData> {
    try {
      const userid = window.location.pathname;

      // 获取用户数据
      console.log("开始获取当前用户的初始化工作簿数据：" + userid);
      const response = await fetch(this.DATA_SERVER_URL + userid);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("当前用户的初始化工作簿数据不存在");
        }
        throw new Error(`请求失败: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const jsonData = JSON.parse(JSON.stringify(data));
      console.log("取得当前用户的初始化工作簿数据:", jsonData);

      return jsonData as IWorkbookData;
    } catch (error) {
      console.error(
        "获取当前用户的初始化工作簿数据失败:",
        (error as Error).stack
      );
      return {} as IWorkbookData;
    }
  }

  /**
   * 更新当前用户的工作簿数据
   * @param params 需要更新的数据参数数组.
   * @returns 更新是否成功.
   */
  public static async updateData(params: IUpdateParams[]): Promise<boolean> {
    try {
      if (!params || params.length === 0) {
        console.warn("没有需要更新的数据");
        return false;
      }

      const userid = window.location.pathname;

      console.log("开始更新当前用户的工作簿数据：" + userid, params);

      const response = await fetch(this.DATA_SERVER_URL + userid, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`请求失败: ${response.status} ${response.statusText}`);
      }

      console.log("更新当前用户的工作簿数据成功");
      return true;
    } catch (error) {
      console.error("更新当前用户的工作簿数据失败:", (error as Error).stack);
      return false;
    }
  }

  /**
   * 更新基础模板的JSON文件
   * @param newTemplateJson 新模板的Json数据.
   * @returns 更新是否成功.
   */
  public static async updateTemplate(newTemplateJson: any): Promise<boolean> {
    try {
      if (!newTemplateJson) {
        console.warn(" 更新基础模板的JSON文件参数异常");
        return false;
      }

      console.log("开始更新基础模板的JSON文件：", newTemplateJson);

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

      console.log("更新基础模板的JSON文件成功");
      return true;
    } catch (error) {
      console.error("更新基础模板的JSON文件失败:", (error as Error).stack);
      return false;
    }
  }
}
