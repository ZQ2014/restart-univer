import { UniverSheetsCorePreset } from "@univerjs/preset-sheets-core";
import UniverPresetSheetsCoreZhCN from "@univerjs/preset-sheets-core/locales/zh-CN";
import {
  createUniver,
  LocaleType,
  LogLevel,
  mergeLocales,
} from "@univerjs/presets";

import "./style.css";
import "@univerjs/preset-sheets-core/lib/index.css";

const { univer, univerAPI } = createUniver({
  locale: LocaleType.ZH_CN,
  locales: {
    [LocaleType.ZH_CN]: mergeLocales(UniverPresetSheetsCoreZhCN),
  },
  logLevel: LogLevel.VERBOSE,
  presets: [
    UniverSheetsCorePreset({
      container: "app",
    }),
  ],
});

univerAPI.createWorkbook({});

// const workbook = this._univerInstanceService.getUnit<Workbook>(workbookId);
// // getCurrentUnitOfType<Workbook>( UniverInstanceType.UNIVER_SHEET );
// const worksheet = workbook?.getSheetBySheetId(worksheetId);
// const range = worksheet?.getRange(row, col);
// if (!workbook || !worksheet || !range) {
//   this._logService.error(
//     "[ChangeTrackerService]",
//     "_updateCellStyle",
//     "workbook or worksheet or range is null",
//     workbookId,
//     workbook,
//     worksheetId,
//     worksheet,
//     range
//   );
//   return;
// }

// const fWorkbook = univerAPI.getActiveWorkbook();
// const fWorksheet = fWorkbook?.getActiveSheet();
// const fRange = fWorksheet?.getRange(row, col);

// const fWorkbook = univerAPI.getWorkbook(workbookId);
// const fWorksheet = fWorkbook?.getSheetBySheetId(worksheetId);
// const fRange = fWorksheet?.getRange(row, col);
