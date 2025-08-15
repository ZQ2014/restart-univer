import { CONFIG_JOURNAL_UNIVER } from "./const";

export const CONFIG_JOURNAL_UNIVER_SYMBOL = Symbol(CONFIG_JOURNAL_UNIVER);

export interface IJournalUniverConfig {
  // 数据服务器的URL
  DATA_SERVER_URL: string;
  // 更新模板的userid
  UPDATE_TEMPLATE_URL: string;
}

export const DefaultJournalUniverConfig: IJournalUniverConfig = {
  DATA_SERVER_URL: "/api/happyq/data",
  UPDATE_TEMPLATE_URL: "Template",
};
