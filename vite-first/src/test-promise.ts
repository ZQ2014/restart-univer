//test Promise async await
let asyncTestCounter = 0;

async function sleep(name: string, ms: number) {
  return new Promise<boolean>((resolve, reject) => {
    console.log("before setTimeout", name);
    setTimeout(() => {
      console.log("in setTimeout", name);
      switch (asyncTestCounter++ % 4) {
        case 0:
          console.log("resolve(true)", name);
          resolve(true);
          break;
        case 1:
          console.log("resolve(false)", name);
          resolve(false);
          break;
        case 2:
          console.log("reject", name);
          reject("reject");
          break;
        default:
          console.log("reject", name);
          reject("reject");
          break;
      }
    }, ms);
    console.log("after setTimeout", name);
  });
}

async function test() {
  console.log("start");
  // 没有使用await，所以不会等；注意：test1的类型是Promise<boolean>，当前状态是pending
  const test1: Promise<boolean> = sleep("test1", 5000);
  console.log("test1 no await", test1);

  // 因为then是异步的，回调函数会在sleep执行完成后执行；此处不会阻塞
  test1.finally(() => {
    console.log("test1 finally"); // 与then/catch的调用先后取决于代码先后
  });
  test1.then((param) => {
    console.log("test1 then", param);
  });
  test1.catch((error) => {
    console.log("test1 catch", error);
  });

  // await会等待sleep执行完成，主线程阻塞；
  const test2: boolean = await sleep("test2", 5000);
  console.log("test2 await", test2);
  // 注意：test2类型是boolean，不是Promise<boolean>，所以以下会报错
  // test2.then((param) => {
  //   console.log("test2 then", param);
  // });
  // test2.catch((error) => {
  //   console.log("test2 catch", error);
  // });
  // test2.finally(() => {
  //   console.log("test2 finally");
  // });

  try {
    // 因为没有await，主线程已经处理过此处及后续代码
    // 所以此处会有一个无法被test3 Outside catch和test Outside catch捕获的异常
    const test3: Promise<boolean> = sleep("test3", 5000);
    console.log("test3 no await", test3);

    test3.catch((error) => {
      // 执行
      console.log("test3 catch", error);
    });
    test3.finally(() => {
      // 执行
      console.log("test3 finally"); // 与then/catch的调用先后取决于代码先后
    });
    test3.then((param) => {
      // 未执行，且会出发第二次无法被test3 Outside catch和test Outside catch捕获的异常
      console.log("test3 then", param);
    });
  } catch (error) {
    console.log("test3 Outside catch", error);
  }

  try {
    const test4: boolean = await sleep("test4", 5000);
    console.log("test4 await reject", test4);
  } catch (error) {
    console.log("test4 Outside catch", error);
  }
  // 对比test3和test4，明显test4的用法更优雅
} // test()

try {
  test();
} catch (error) {
  console.log("test Outside catch", error);
}
