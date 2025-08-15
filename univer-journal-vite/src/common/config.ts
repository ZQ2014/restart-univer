import { CONFIG_JOURNAL_UNIVER } from "./const";

export const CONFIG_JOURNAL_UNIVER_SYMBOL = Symbol(CONFIG_JOURNAL_UNIVER);

export interface ISimpleDemoConfig {
      // 数据服务器的URL
      protected static readonly DATA_SERVER_URL = "/api/happyq/data";
      // 更新模板的userid
      protected static readonly UPDATE_TEMPLATE_ID = "Template";
    
}

export const defaultSimpleDemConfig: ISimpleDemoConfig = {};
