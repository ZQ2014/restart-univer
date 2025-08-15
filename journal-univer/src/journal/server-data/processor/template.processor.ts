import { IWorkbookData, UniverInstanceType, Workbook } from "@univerjs/presets";
import {
  IServerDataService,
  IUpdateResult,
  OperationType,
} from "./server-data.service";
import { IUniverInstanceService } from "@univerjs/core";

export class TemplateServerDataService implements IServerDataService {
  constructor(private readonly userid: string) {}

  async getInitWorkbookData(): Promise<IWorkbookData> {
    return {} as IWorkbookData;
  }

  async update(): Promise<IUpdateResult[]> {
    return [];
  }

  getOprationType(): OperationType {
    return OperationType.template;
  }

  getUserId(): string {
    return this.userid;
  }
}
