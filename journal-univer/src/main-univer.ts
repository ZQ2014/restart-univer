import { UniverSheetsCorePreset } from "@univerjs/preset-sheets-core";
import UniverPresetSheetsCoreZhCN from "@univerjs/preset-sheets-core/locales/zh-CN";
import { UniverSheetsFilterPreset } from "@univerjs/preset-sheets-filter";
import UniverPresetSheetsFilterZhCN from "@univerjs/preset-sheets-filter/locales/zh-CN";
import { UniverSheetsSortPreset } from "@univerjs/preset-sheets-sort";
import UniverPresetSheetsSortZhCN from "@univerjs/preset-sheets-sort/locales/zh-CN";
import { UniverSheetsDataValidationPreset } from "@univerjs/preset-sheets-data-validation";
import UniverPresetSheetsDataValidationZhCN from "@univerjs/preset-sheets-data-validation/locales/zh-CN";
import { UniverSheetsConditionalFormattingPreset } from "@univerjs/preset-sheets-conditional-formatting";
import UniverPresetSheetsConditionalFormattingZhCN from "@univerjs/preset-sheets-conditional-formatting/locales/zh-CN";
import { UniverSheetsHyperLinkPreset } from "@univerjs/preset-sheets-hyper-link";
import UniverPresetSheetsHyperLinkZhCN from "@univerjs/preset-sheets-hyper-link/locales/zh-CN";
import { UniverSheetsFindReplacePreset } from "@univerjs/preset-sheets-find-replace";
import UniverPresetSheetsFindReplaceZhCN from "@univerjs/preset-sheets-find-replace/locales/zh-CN";
import { UniverSheetsDrawingPreset } from "@univerjs/preset-sheets-drawing";
import UniverPresetSheetsDrawingZhCN from "@univerjs/preset-sheets-drawing/locales/zh-CN";
import { UniverSheetsThreadCommentPreset } from "@univerjs/preset-sheets-thread-comment";
import UniverPresetSheetsThreadCommentZhCN from "@univerjs/preset-sheets-thread-comment/locales/zh-CN";
import { UniverSheetsNotePreset } from "@univerjs/preset-sheets-note";
import UniverPresetSheetsNoteZhCN from "@univerjs/preset-sheets-note/locales/zh-CN";
import { UniverSheetsTablePreset } from "@univerjs/preset-sheets-table";
import UniverPresetSheetsTableZhCN from "@univerjs/preset-sheets-table/locales/zh-CN";
// import { UniverWatermarkPlugin } from "@univerjs/watermark";
// import "@univerjs/watermark/facade";
import { UniverSheetsCrosshairHighlightPlugin } from "@univerjs/sheets-crosshair-highlight";
import SheetsCrosshairHighlightZhCN from "@univerjs/sheets-crosshair-highlight/locale/zh-CN";
import "@univerjs/sheets-crosshair-highlight/facade";
import { UniverSheetsZenEditorPlugin } from "@univerjs/sheets-zen-editor";
import SheetsZenEditorZhCN from "@univerjs/sheets-zen-editor/locale/zh-CN";
import "@univerjs/sheets-zen-editor/facade";
import { UniverUniscriptPlugin } from "@univerjs/uniscript";
import UniscriptZhCN from "@univerjs/uniscript/locale/zh-CN";
import {
  createUniver,
  LocaleType,
  LogLevel,
  mergeLocales,
} from "@univerjs/presets";

// 引入自定义插件

import "@univerjs/preset-sheets-core/lib/index.css";
import "@univerjs/preset-sheets-filter/lib/index.css";
import "@univerjs/preset-sheets-sort/lib/index.css";
import "@univerjs/preset-sheets-data-validation/lib/index.css";
import "@univerjs/preset-sheets-conditional-formatting/lib/index.css";
import "@univerjs/preset-sheets-find-replace/lib/index.css";
import "@univerjs/preset-sheets-drawing/lib/index.css";
import "@univerjs/preset-sheets-thread-comment/lib/index.css";
import "@univerjs/preset-sheets-note/lib/index.css";
import "@univerjs/preset-sheets-table/lib/index.css";
import "@univerjs/sheets-crosshair-highlight/lib/index.css";
import "@univerjs/sheets-zen-editor/lib/index.css";
import "@univerjs/uniscript/lib/index.css";

// import { WORKBOOK_DATA } from "./data";
import "./style.css";

export const { univer, univerAPI } = createUniver({
  locale: LocaleType.ZH_CN,
  locales: {
    [LocaleType.ZH_CN]: mergeLocales(
      UniverPresetSheetsCoreZhCN,
      UniverPresetSheetsFilterZhCN,
      UniverPresetSheetsSortZhCN,
      UniverPresetSheetsDataValidationZhCN,
      UniverPresetSheetsConditionalFormattingZhCN,
      UniverPresetSheetsHyperLinkZhCN,
      UniverPresetSheetsFindReplaceZhCN,
      UniverPresetSheetsDrawingZhCN,
      UniverPresetSheetsThreadCommentZhCN,
      UniverPresetSheetsNoteZhCN,
      UniverPresetSheetsTableZhCN,
      SheetsCrosshairHighlightZhCN,
      SheetsZenEditorZhCN,
      UniscriptZhCN
    ),
  },
  logLevel: LogLevel.VERBOSE,
  presets: [
    UniverSheetsCorePreset({
      container: "app",
    }),
    UniverSheetsFilterPreset(),
    UniverSheetsSortPreset(),
    UniverSheetsDataValidationPreset({
      // 是否在下拉菜单中显示编辑按钮
      showEditOnDropdown: true,
    }),
    UniverSheetsConditionalFormattingPreset(),
    UniverSheetsHyperLinkPreset(),
    UniverSheetsFindReplacePreset(),
    UniverSheetsDrawingPreset(),
    UniverSheetsThreadCommentPreset(),
    UniverSheetsNotePreset(),
    UniverSheetsTablePreset(),
  ],
  plugins: [
    // 水印插件的注册
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
    UniverUniscriptPlugin,
    // 引入自定义插件
  ],
});

const fWorkbookEmpty = univerAPI.createWorkbook({});

//请求用户初始化数据WORKBOOK_DATA
// const fWorkbookUserData = univerAPI.createWorkbook(WORKBOOK_DATA});
// const univerInstanceService = univer
//   .__getInjector()
//   .get(IUniverInstanceService);
// univerInstanceService.disposeUnit(fWorkbookEmpty.getId());
