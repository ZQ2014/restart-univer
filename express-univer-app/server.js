const express = require("express");
const bodyParser = require("body-parser");
const { Workbook } = require("@univerjs/core");

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 配置中间件
app.use(bodyParser.json()); // 解析JSON请求体
app.use(express.static("public")); // 静态文件服务

// 内存中存储工作簿数据
let workbookData = null;

// 初始化默认工作簿
function initDefaultWorkbook() {
  return {
    id: "workbook-01",
    sheetOrder: ["sheet1"],
    sheets: {
      sheet1: {
        id: "sheet1",
        name: "默认工作表",
        cellData: {
          0: {
            0: { v: "欢迎使用Univer.js", t: 1 },
            1: { v: "Express服务器", t: 1 },
          },
        },
      },
    },
  };
}

// API 端点
app.get("/api/workbook", (req, res) => {
  if (!workbookData) workbookData = initDefaultWorkbook();
  res.json(workbookData);
});

app.post("/api/workbook", (req, res) => {
  try {
    // 数据验证
    if (!req.body || !req.body.sheets) {
      return res.status(400).json({ error: "无效的工作簿数据" });
    }

    // 保存数据
    workbookData = req.body;
    res.json({ success: true, message: "工作簿保存成功" });
  } catch (error) {
    res.status(500).json({ error: "服务器错误" });
  }
});

app.get("/api/status", (req, res) => {
  res.json({
    status: "运行中",
    version: "1.0.0",
    workbookLoaded: !!workbookData,
  });
});

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
