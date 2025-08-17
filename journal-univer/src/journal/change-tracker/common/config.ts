import type { IStyleData } from "@univerjs/presets";
import { CONFIG_KEY_CHANGE_TRACKER } from "./const";

export const configSymbolChangeTracker = Symbol(CONFIG_KEY_CHANGE_TRACKER);

// 插件配置
export interface IChangeTrackerConfig {
  // 自定义样式配置
  styles?: {
    pending?: IStyleData;
    updating?: IStyleData;
    updated?: IStyleData;
    failed?: IStyleData;
  };
  // 成功更新后清除样式的延迟时间（毫秒）
  clearStyleDelay?: number;
}

export const defaultChangeTrackerConfig: IChangeTrackerConfig = {
  styles: {
    pending: { bg: { rgb: "rgba(255, 255, 0, 0.3)" } }, // 黄色
    updating: { bg: { rgb: "rgba(0, 0, 255, 0.3)" } }, // 蓝色
    updated: { bg: { rgb: "rgba(0, 255, 0, 0.3)" } }, // 绿色
    failed: { bg: { rgb: "rgba(255, 0, 0, 0.3)" } }, // 红色
  },
  clearStyleDelay: 3000,
};
