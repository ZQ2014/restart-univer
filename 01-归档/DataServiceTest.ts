// import {
//   DataServiceType,
//   DataServiceFactory,
//   IDataService,
// } from "./DataService";

// // 使用示例
// (async () => {
//   // 创建文件服务实例
//   const fileService: IDataService = DataServiceFactory.createService("file");

//   // 测试fetchData
//   const userData = await fileService.fetchData("zq");
//   console.log("Fetched  data:", userData);

//   // 测试updateData
//   const updateParams = [
//     { id: "001", name: "Alice", age: 30 },
//     { id: "002", email: "bob@example.com" },
//   ];

//   const updateResults = await fileService.updateData(updateParams);
//   console.log("Update  results:", updateResults);
// })();
