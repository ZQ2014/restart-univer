import fs from "fs/promises";

export type DataServiceType = "database" | "file";

export interface UpdateParam {
  id: string;
  [key: string]: any; // 允许其他任意更新字段
}

export interface UpdateResult {
  id: string;
  success: boolean;
}

export interface IDataService {
  fetchData(userId: string): Promise<any>;
  updateData(params: UpdateParam[]): Promise<UpdateResult[]>;
}

export class DatabaseService implements IDataService {
  //   private readonly dataDir = "../data";

  constructor() {
    this.connectDatabase();
  }

  private async connectDatabase() {
    // try {
    //   await fs.mkdir(this.dataDir, { recursive: true });
    // } catch (error) {
    //   console.error("Error  connecting database:", error.stack);
    // }
  }

  async fetchData(userId: string): Promise<any> {
    // 模拟数据库查询
    console.log(`[Database]  Fetching data for user: ${userId}`);
    return {
      userId,
      data: `Database data for ${userId}`,
      timestamp: new Date().toISOString(),
    };
  }

  async updateData(params: UpdateParam[]): Promise<UpdateResult[]> {
    console.log("[Database]  Batch update started");
    const results: UpdateResult[] = [];

    for (const param of params) {
      try {
        // 模拟数据库更新操作
        console.log(`[Database]  Updating record ${param.id}`, param);
        // 假设90%成功率
        const success = Math.random() > 0.1;
        results.push({ id: param.id, success });

        if (!success) {
          console.error(`[Database]  Update failed for ${param.id}`);
        } else {
          console.log(`[Database]  Update successful for ${param.id}`);
        }
      } catch (error) {
        console.error(
          `[Database]  Error updating ${param.id}:`,
          (error as Error).stack
        );
        results.push({ id: param.id, success: false });
      }
    }

    return results;
  }
}

export class FileService implements IDataService {
  private readonly dataDir = "./data";

  constructor() {
    this.ensureDataDir();
  }

  private async ensureDataDir() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
    } catch (error) {
      console.error("Error  creating data directory:", (error as Error).stack);
    }
  }

  /**
   * 从文件中读取用户数据（未处理异常）
   * @param userId 用户ID
   * @returns 用户数据
   */
  async fetchData(userId: string): Promise<any> {
    let jsonData = {};

    const filePath = `${this.dataDir}/user_${userId}.json`;
    const fileContent = await fs.readFile(filePath, "utf8");
    console.log(
      `读取用户数据文件成功:${filePath}(长度: ${fileContent.length})`
    );

    jsonData = JSON.parse(fileContent);
    console.log("用户数据转换JSON成功");

    return jsonData;
  }

  async updateData(params: UpdateParam[]): Promise<UpdateResult[]> {
    const results: UpdateResult[] = [];

    for (const param of params) {
      try {
        // 模拟文件更新操作 待实现
        const filePath = `${this.dataDir}/user_${param.id}.json`;

        // 将数据写入文件
        await fs.writeFile(
          filePath,
          JSON.stringify(param.jsonData, null, 2),
          "utf8"
        );

        console.log(`[File]  Updated user ${param.id}  file`);
        results.push({ id: param.id, success: true });
      } catch (error) {
        console.error(
          `[File]  Update failed for ${param.id}:`,
          (error as Error).stack
        );
        results.push({ id: param.id, success: false });
      }
    }

    return results;
  }
}

export class DataServiceFactory {
  static async createService(type: DataServiceType): Promise<IDataService> {
    switch (type) {
      case "database":
        return new DatabaseService();
      case "file":
        return new FileService();
      default:
        throw new Error(`Invalid service type: ${type}`);
    }
  }
}
