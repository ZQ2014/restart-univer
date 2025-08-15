import type { IWorkbookData } from "@univerjs/presets";
import {
  type IServerDataService,
  type IUpdateResult,
  OperationType,
} from "./server-data.service";

export class NullServerDataService implements IServerDataService {
  constructor(private readonly _userid: string) {
    super();
  }

  async getInitWorkbookData(): Promise<IWorkbookData> {
    return {} as IWorkbookData;
  }

  async update(): Promise<IUpdateResult[]> {
    return [];
  }

  getOprationType(): OperationType {
    return OperationType.null;
  }

  getUserId(): string {
    return "";
  }
}
