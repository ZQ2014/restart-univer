import express from "express";
import bodyParser from "body-parser";

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 配置中间件
app.use(bodyParser.json()); // 解析JSON请求体
app.use(express.static("public")); // 静态文件服务

// // 定义根路由处理
// app.get("/", (req, res) => {
//   res.send("Hello  Express World!");
// });

// // 定义其他示例路由
// app.get("/api", (req, res) => {
//   res.json({ message: "API endpoint works!" });
// });

// // 数据更新端点：POST /update
// app.post("/update", async (req, res) => {
//   const { userId, data } = req.body;
//   if (!userId || !data) {
//     return res.status(400).json({ error: "Missing userId or data" });
//   }
// });

// 启动服务器
const startServer = async () => {
  app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("服务器启动失败:", err);
  process.exit(1);
});
