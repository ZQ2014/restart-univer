import { UniverSheetsConditionalFormattingPreset } from "@univerjs/preset-sheets-conditional-formatting";
import sheetsConditionalFormattingZhCN from "@univerjs/preset-sheets-conditional-formatting/locales/zh-CN";
import { UniverSheetsCorePreset } from "@univerjs/preset-sheets-core";
import sheetsCoreZhCN from "@univerjs/preset-sheets-core/locales/zh-CN";
import { UniverSheetsDataValidationPreset } from "@univerjs/preset-sheets-data-validation";
import sheetsDataValidationZhCN from "@univerjs/preset-sheets-data-validation/locales/zh-CN";
import { UniverSheetsDrawingPreset } from "@univerjs/preset-sheets-drawing";
import sheetsDrawingZhCN from "@univerjs/preset-sheets-drawing/locales/zh-CN";
import { UniverSheetsFilterPreset } from "@univerjs/preset-sheets-filter";
import UniverPresetSheetsFilterZhCN from "@univerjs/preset-sheets-filter/locales/zh-CN";
import { UniverSheetsFindReplacePreset } from "@univerjs/preset-sheets-find-replace";
import UniverPresetSheetsFindReplaceZhCN from "@univerjs/preset-sheets-find-replace/locales/zh-CN";
import { UniverSheetsHyperLinkPreset } from "@univerjs/preset-sheets-hyper-link";
import sheetsHyperLinkZhCN from "@univerjs/preset-sheets-hyper-link/locales/zh-CN";
import { UniverSheetsSortPreset } from "@univerjs/preset-sheets-sort";
import SheetsSortZhCN from "@univerjs/preset-sheets-sort/locales/zh-CN";
import { UniverSheetsThreadCommentPreset } from "@univerjs/preset-sheets-thread-comment";
import UniverPresetSheetsThreadCommentZhCN from "@univerjs/preset-sheets-thread-comment/locales/zh-CN";
import {
  createUniver,
  LocaleType,
  LogLevel,
  mergeLocales,
  type IWorkbookData,
} from "@univerjs/presets";
import { UniverSheetsCrosshairHighlightPlugin } from "@univerjs/sheets-crosshair-highlight";
import SheetsCrosshairHighlightZhCN from "@univerjs/sheets-crosshair-highlight/locale/zh-CN";
import { UniverSheetsZenEditorPlugin } from "@univerjs/sheets-zen-editor";
import SheetsZenEditorZhCN from "@univerjs/sheets-zen-editor/locale/zh-CN";
// 隐藏水印插件的导入
// import { UniverWatermarkPlugin } from "@univerjs/watermark";

import { ServerDataService } from "./services/server-data/server-data.service";
import ServerDataPlugin from "./plugins/ServerDataPlugin";

import "./style.css";
import "@univerjs/preset-sheets-core/lib/index.css";
import "@univerjs/preset-sheets-sort/lib/index.css";
import "@univerjs/preset-sheets-filter/lib/index.css";
import "@univerjs/preset-sheets-conditional-formatting/lib/index.css";
import "@univerjs/preset-sheets-data-validation/lib/index.css";
import "@univerjs/preset-sheets-drawing/lib/index.css";
import "@univerjs/preset-sheets-hyper-link/lib/index.css";
import "@univerjs/preset-sheets-find-replace/lib/index.css";
import "@univerjs/preset-sheets-thread-comment/lib/index.css";
import "@univerjs/sheets-zen-editor/lib/index.css";
import "@univerjs/sheets-crosshair-highlight/lib/index.css";

const { univerAPI } = createUniver({
  locale: LocaleType.ZH_CN,
  locales: {
    [LocaleType.ZH_CN]: mergeLocales(
      sheetsCoreZhCN,
      SheetsSortZhCN,
      UniverPresetSheetsFilterZhCN,
      sheetsConditionalFormattingZhCN,
      sheetsDataValidationZhCN,
      UniverPresetSheetsFindReplaceZhCN,
      sheetsDrawingZhCN,
      sheetsHyperLinkZhCN,
      UniverPresetSheetsThreadCommentZhCN,
      SheetsCrosshairHighlightZhCN,
      SheetsZenEditorZhCN
    ),
  },
  logLevel: LogLevel.VERBOSE,
  presets: [
    UniverSheetsCorePreset({
      container: "app",
    }),
    UniverSheetsFindReplacePreset(),
    UniverSheetsSortPreset(),
    UniverSheetsFilterPreset(),
    UniverSheetsConditionalFormattingPreset(),
    UniverSheetsDataValidationPreset(),
    UniverSheetsDrawingPreset(),
    UniverSheetsFilterPreset(),
    UniverSheetsHyperLinkPreset(),
    UniverSheetsThreadCommentPreset(),
  ],
  plugins: [
    // 隐藏水印插件的注册
    // [
    //   UniverWatermarkPlugin,
    //   {
    //     textWatermarkSettings: {
    //       content: "Hello, Univer!",
    //       fontSize: 16,
    //       color: "rgb(0,0,0)",
    //       bold: false,
    //       italic: false,
    //       direction: "ltr",
    //       x: 60,
    //       y: 36,
    //       repeat: true,
    //       spacingX: 200,
    //       spacingY: 100,
    //       rotate: 0,
    //       opacity: 0.15,
    //     },
    //   },
    // ],
    UniverSheetsCrosshairHighlightPlugin,
    UniverSheetsZenEditorPlugin,
    ServerDataPlugin, // 自定义插件注册
  ],
});

// static WORKBOOK_DATA: Partial<IWorkbookData> = {};

console.log("univerAPI.createWorkbook(WORKBOOK_DATA);");
(async () => {
  const initData: Partial<IWorkbookData> =
    await ServerDataService.getInitWorkbookData();

  univerAPI.createWorkbook(initData);
})();
console.log("univerAPI.createWorkbook(WORKBOOK_DATA)完成");
