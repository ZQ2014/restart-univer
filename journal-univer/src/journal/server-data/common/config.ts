import { CONFIG_KEY_SERVER_DATA } from "./const";

export const configSymbolServerData = Symbol(CONFIG_KEY_SERVER_DATA);

export interface IServerDataConfig {
  // 数据服务器的URL
  DATA_SERVER_URL: string;
  // 更新模板的userid
  UPDATE_TEMPLATE_URL: string;
}

export const defaultServerDataConfig: IServerDataConfig = {
  DATA_SERVER_URL: "/api/happyq/data",
  UPDATE_TEMPLATE_URL: "Template",
};
