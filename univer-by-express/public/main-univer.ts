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
