// 初始化Univer
const univer = new Univer();

// 创建默认工作簿
function initDefaultWorkbook() {
  return univer.createUniverSheet({
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
  });
}

// 从服务器加载工作簿
async function loadWorkbookFromServer() {
  const response = await fetch("/api/workbook");
  const workbookData = await response.json();

  // 销毁现有工作簿并创建新实例
  if (workbookInstance) workbookInstance.dispose();
  workbookInstance = univer.createUniverSheet(workbookData);
  renderWorkbook();
}

// 保存工作簿到服务器
async function saveWorkbookToServer() {
  const workbook = univerInstanceService.getCurrentUnitForType(
    UniverInstanceType.UNIVER_SHEET
  );
  const snapshot = workbook.getSnapshot();

  await fetch("/api/workbook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(snapshot),
  });
}
