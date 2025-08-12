// import {
//   ICommandService,
//   IUniverInstanceService,
//   Tools,
//   Univer,
//   UniverInstanceType,
//   Workbook,
//   IResourceManagerService,
//   LocaleService,
// } from "@univerjs/core";
// import { Inject, Injector, Plugin, MessageType } from "@univerjs/presets";
// import { IMessageService } from "@univerjs/ui";

// export class RemoteDataInitPlugin extends Plugin {
//   static override type = UniverInstanceType.UNIVER_SHEET;
//   static override pluginName = "REMOTE_DATA_INIT_PLUGIN";

//   // 配置项：数据API地址
//   private readonly DATA_API_URL = "http://localhost:3000/data";

//   constructor(
//     private _config: undefined,
//     @Inject(Injector) readonly _injector: Injector
//   ) {
//     super();
//   }

//   override async onReady(): Promise<void> {
//     // 确保UI渲染完成后再加载数据
//     setTimeout(() => this.initWorkbookFromRemote(), 100);
//   }

//   private async initWorkbookFromRemote() {
//     const univerInstanceService = this._injector.get(IUniverInstanceService);
//     const messageService = this._injector.get(IMessageService);
//     const resourceManagerService = this._injector.get(IResourceManagerService);
//     const localeService = this._injector.get(LocaleService);

//     try {
//       // 显示加载状态
//       messageService.show({
//         type: MessageType.Loading,
//         content: localeService.t("plugin.remoteDataInit.loading"),
//         duration: 0,
//       });

//       // 从API获取数据
//       const response = await fetch(this.DATA_API_URL);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const remoteData = await response.json();

//       // 验证数据格式
//       if (!this.validateWorkbookData(remoteData)) {
//         throw new Error("Invalid workbook data format");
//       }

//       // 获取当前工作簿
//       let workbook = univerInstanceService.getCurrentUnitOfType<Workbook>(
//         UniverInstanceType.UNIVER_SHEET
//       );

//       if (workbook) {
//         // 更新现有工作簿
//         await this.updateExistingWorkbook(workbook, remoteData);
//       } else {
//         // 创建新工作簿
//         univerInstanceService.createUnit(
//           UniverInstanceType.UNIVER_SHEET,
//           remoteData
//         );
//       }

//       // 保存资源引用
//       resourceManagerService.registerPluginResource(this, remoteData);

//       // 显示成功消息
//       messageService.show({
//         type: "success",
//         content: localeService.t("plugin.remoteDataInit.success"),
//       });
//     } catch (error) {
//       console.error("Failed to initialize workbook from remote:", error);

//       // 显示错误消息
//       messageService.show({
//         type: "error",
//         content: localeService.t("plugin.remoteDataInit.error", {
//           message: error.message,
//         }),
//       });

//       // 创建空工作簿作为回退
//       this.createFallbackWorkbook();
//     } finally {
//       // 隐藏加载状态
//       messageService.hide();
//     }
//   }

//   // 验证远程数据格式
//   private validateWorkbookData(data: any): boolean {
//     return (
//       data &&
//       typeof data.id === "string" &&
//       data.sheets &&
//       typeof data.sheets === "object" &&
//       Array.isArray(data.sheetOrder)
//     );
//   }

//   // 更新现有工作簿
//   private async updateExistingWorkbook(workbook: Workbook, newData: any) {
//     const commandService = this._injector.get(ICommandService);

//     // 保存当前工作簿状态
//     const snapshot = workbook.getSnapshot();

//     try {
//       // 执行重置工作簿命令
//       await commandService.executeCommand("sheet.command.reset-workbook", {
//         unitId: workbook.getUnitId(),
//         snapshot: newData,
//       });
//     } catch (e) {
//       // 如果重置失败，恢复原始状态
//       await commandService.executeCommand("sheet.command.reset-workbook", {
//         unitId: workbook.getUnitId(),
//         snapshot,
//       });
//       throw e;
//     }
//   }

//   // 创建回退工作簿
//   private createFallbackWorkbook() {
//     const univerInstanceService = this._injector.get(IUniverInstanceService);
//     const localeService = this._injector.get(LocaleService);

//     const fallbackData = Workbook.getEmptyWorkbookSnapshot();
//     fallbackData.id = "fallback-workbook";

//     // 在第一个单元格添加错误信息
//     const sheetId = fallbackData.sheetOrder[0];
//     fallbackData.sheets[sheetId].cellData = {
//       "0": {
//         "0": {
//           v: localeService.t("plugin.remoteDataInit.fallbackMessage"),
//           m: localeService.t("plugin.remoteDataInit.fallbackMessage"),
//           t: 1, // 字符串类型
//         },
//       },
//     };

//     univerInstanceService.createUnit(
//       UniverInstanceType.UNIVER_SHEET,
//       fallbackData
//     );
//   }
// }

// // 初始化Univer并注册插件
// const univer = new Univer();
// univer.registerPlugin(RemoteDataInitPlugin);
