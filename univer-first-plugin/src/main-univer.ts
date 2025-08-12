import { UniverSheetsCorePreset } from "@univerjs/preset-sheets-core";
import UniverPresetSheetsCoreZhCN from "@univerjs/preset-sheets-core/locales/zh-CN";
import {
  createUniver,
  LocaleType,
  LogLevel,
  mergeLocales,
} from "@univerjs/presets";

// 引入自定义插件
import FirstPlugin from "./plugins/FirstPlugin";

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
  plugins: [
    // FirstPlugin, // 注册自定义插件
  ],
});

univer.registerPlugin(FirstPlugin); // 注册自定义插件

univerAPI.createWorkbook({});
