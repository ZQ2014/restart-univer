import { SIMPLE_DEMO_CONFIG_KEY } from "./const";

export const configSymbol = Symbol(SIMPLE_DEMO_CONFIG_KEY);

export interface ISimpleDemoConfig {}

export const defaultSimpleDemConfig: ISimpleDemoConfig = {};
