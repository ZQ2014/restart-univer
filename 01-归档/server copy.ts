// // server.ts
// import express from "express";
// import fs from "fs/promises";
// import path from "path";
// import { fileURLToPath } from "url";
// import bodyParser from "body-parser";

// // 获取当前模块的目录路径
// // const __filename = fileURLToPath(import.meta.url);
// // console.log("当前文件路径:", __filename);
// // const __dirname = path.dirname(__filename);
// // console.log("当前目录路径:", path.dirname(__filename));

// // 创建Express应用
// const app = express();
// const PORT = process.env.PORT || 3000;

// // 静态文件服务
// app.use("/test", express.static("public/test.html")); // 测试页面，用于测试后去数据接口
// app.use("/univer", express.static("public/univer.html")); // Univer页面，用于修改模板JSON

// // 解析JSON请求体
// app.use(express.json({ limit: "10mb" }));
// app.use(
//   express.urlencoded({
//     limit: "10mb",
//     extended: true, // 允许解析嵌套对象
//   })
// );

// // 全局异常处理
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send("Server  Error!");
// });

// // // 处理数据目录路径
// // const dataDir = path.join(__dirname, "data");
// // // 确保数据目录存在
// // const ensureDataDir = async () => {
// //   try {
// //     await fs.mkdir(dataDir, { recursive: true });
// //     console.log(`数据目录已创建: ${dataDir}`);
// //   } catch (err) {
// //     console.error("创建数据目录失败:", err.stack);
// //   }
// // };

// // 1. 获取用户数据：GET /:userid
// app.get("/api/happyq/data/:userid", async (req, res) => {
//   try {
//     const userId = req.params.userid;
//     console.log("【Get】" + userId);

//     // 验证用户ID格式
//     // if (!/^[a-zA-Z0-9-]{2,20}$/.test(userId)) {
//     //   console.error("无效的用户ID格式:" + userId);
//     //   return res.status(400).json({
//     //     success: false,
//     //     message: "无效的用户ID格式",
//     //   });
//     // }

//     const jsonPath = path.join(dataDir, `${userId}.json`);

//     // 尝试读取JSON文件
//     let jsonData = {};
//     try {
//       const fileContent = await fs.readFile(jsonPath, "utf8");
//       console.log(
//         `读取用户数据文件成功:${jsonPath}(长度: ${fileContent.length})`
//       );

//       jsonData = JSON.parse(fileContent);
//       console.log("用户数据转换JSON成功");
//     } catch (error) {
//       if (error.code === "ENOENT") {
//         console.error("用户数据不存在1:" + userId, error.stack);
//         return res.status(404).json({
//           success: false,
//           message: "用户数据不存在1",
//         });
//       } else {
//         console.error("读取用户数据异常", error.stack);
//         throw error;
//       }
//     }

//     res.json(jsonData);
//   } catch (error) {
//     console.error("处理请求时出错:", error.stack);

//     if (error.code === "ENOENT") {
//       res.status(404).json({
//         success: false,
//         message: "用户数据不存在2",
//       });
//     } else if (error instanceof SyntaxError) {
//       res.status(500).json({
//         success: false,
//         message: "JSON解析失败",
//       });
//     } else {
//       res.status(500).json({
//         success: false,
//         message: "服务器内部错误",
//       });
//     }
//   }
// });

// // 2. 更新数据：POST /update
// app.post("/api/happyq/data/:userid", async (req, res) => {
//   try {
//     const userId = req.params.userid;
//     const data = req.body;
//     console.log(`【Post】${userId}\n${data}`);

//     // 验证输入
//     if (!userId || !data) {
//       console.error(`缺少必要的参数`);
//       return res.status(400).json({
//         success: false,
//         message: "缺少必要的参数: userId 或 data",
//       });
//     }

//     // 验证用户ID格式
//     // if (!/^[a-zA-Z0-9-]{2,20}$/.test(userId)) {
//     //   console.error("无效的用户ID格式:" + userId);
//     //   return res.status(400).json({
//     //     success: false,
//     //     message: "无效的用户ID格式",
//     //   });
//     // }

//     const jsonPath = path.join(dataDir, `${userId}.json`);

//     // 将数据写入文件
//     await fs.writeFile(jsonPath, JSON.stringify(data, null, 2), "utf8");

//     console.log(`Post:${userId} 数据更新成功`);
//     res.json({
//       success: true,
//       message: "数据更新成功",
//       path: jsonPath,
//     });
//   } catch (error) {
//     console.error("更新数据时出错:", error.stack);
//     res.status(500).json({
//       success: false,
//       message: "更新数据失败",
//     });
//   }
// });

// // 启动服务器
// const startServer = async () => {
//   await ensureDataDir();

//   app.listen(PORT, () => {
//     console.log(`服务器运行在 http://localhost:${PORT}`);
//     console.log(`数据目录: ${dataDir}`);
//     console.log("路由说明:");
//     console.log(`  - 测试页面: http://localhost:${PORT}/test`);
//     console.log(`  - Univer页面: http://localhost:${PORT}/univer`);
//     console.log(
//       `  - 获取用户数据: GET http://localhost:${PORT}/api/happyq/data/:userid`
//     );
//     console.log(
//       `  - 更新数据: POST http://localhost:${PORT}/api/happyq/data/:userid`
//     );
//   });
// };

// startServer().catch((err) => {
//   console.error("服务器启动失败:", err);
//   process.exit(1);
// });
