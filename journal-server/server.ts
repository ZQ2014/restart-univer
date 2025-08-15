// server.ts
import express from "express";
import { DataServiceFactory } from "./services/DataService";
import type { IDataService } from "./services/DataService";

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 静态文件服务
app.use("/test", express.static("public/test.html")); // 测试页面，用于测试后去数据接口
app.use("/univer", express.static("public/univer.html")); // Univer页面，用于修改模板JSON

// 解析JSON请求体
app.use(express.json({ limit: "10mb" }));
app.use(
  express.urlencoded({
    limit: "10mb",
    extended: true, // 允许解析嵌套对象
  })
);

// 数据服务实例
let dataService: IDataService;
const dataServiceType = "file";

// 1. 获取用户数据：GET
app.get("/api/happyq/data/:userid", async (req, res) => {
  console.log(
    `————————————————————————————————————————————————————————————————————————————————————`
  );
  try {
    const userId = req.params.userid;
    console.log("【Get】" + userId);

    // 验证用户ID格式
    // if (!/^[a-zA-Z0-9-]{2,20}$/.test(userId)) {
    //   console.error("无效的用户ID格式:" + userId);
    //   return res.status(400).json({
    //     success: false,
    //     message: "无效的用户ID格式",
    //   });
    // }

    const jsonData = await dataService.fetchData(userId);
    console.log(`获取用户数据JSON成功:${userId}`);
    res.json(jsonData);
  } catch (error) {
    // 尝试读取JSON文件
    console.error("获用户数据时出错:", (error as Error).stack);

    if (error.code === "ENOENT") {
      res.status(404).json({
        success: false,
        message: "用户数据不存在：" + (error as Error).message,
      });
    } else if (error instanceof SyntaxError) {
      res.status(500).json({
        success: false,
        message: "JSON解析失败：" + (error as Error).message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "服务器内部错误：" + (error as Error).message,
      });
    }
  }
});

// 2. 更新数据：POST
app.post("/api/happyq/data/:userid", async (req, res) => {
  console.log(
    `————————————————————————————————————————————————————————————————————————————————————`
  );
  try {
    const userId = req.params.userid;
    const data = req.body;
    console.log(`【Post】${userId}\n${data}`);

    // 验证输入
    if (!userId || !data) {
      console.error(`缺少必要的参数`);
      return res.status(400).json({
        success: false,
        message: "缺少必要的参数: userId 或 data",
      });
    }

    // 验证用户ID格式
    // if (!/^[a-zA-Z0-9-]{2,20}$/.test(userId)) {
    //   console.error("无效的用户ID格式:" + userId);
    //   return res.status(400).json({
    //     success: false,
    //     message: "无效的用户ID格式",
    //   });
    // }

    const updateParams = [{ id: userId, jsonData: data }];

    const results = await dataService.updateData(updateParams);

    console.log(`Post:${userId} 数据更新成功`);
    res.json({
      success: true,
      message: "数据更新成功",
      results: results,
    });
  } catch (error) {
    console.error("更新数据时出错:", (error as Error).stack);
    res.status(500).json({
      success: false,
      message: "更新数据失败",
    });
  }
});

// 启动服务器
const startServer = async () => {
  // 创建数据服务实例
  dataService = await DataServiceFactory.createService(dataServiceType);
  console.log("创建数据服务实例成功");

  app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log(`数据服务类型: ${dataServiceType}`);
    console.log("路由说明:");
    console.log(`  - 测试页面: http://localhost:${PORT}/test`);
    console.log(`  - Univer页面: http://localhost:${PORT}/univer`);
    console.log(
      `  - 获取用户数据: GET http://localhost:${PORT}/api/happyq/data/:userid`
    );
    console.log(
      `  - 更新数据: POST http://localhost:${PORT}/api/happyq/data/:userid`
    );
    console.log(
      `————————————————————————————————————————————————————————————————————————————————————`
    );
  });
};

startServer().catch((err) => {
  console.error("服务器启动失败:", err);
  process.exit(1);
});
