import "./style.css";
import typescriptLogo from "./typescript.svg";
import viteLogo from "/vite.svg";
import { setupCounter } from "./counter.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);

//test Promise async await
async function sleep(ms: number) {
  return new Promise<boolean>((resolve, reject) => {
    console.log("before setTimeout");
    setTimeout(() => {
      console.log("in setTimeout");
      resolve(true);
    }, ms);
    reject("error");
    console.log("after setTimeout");
  });
}

async function test() {
  console.log("start");
  const rr = sleep(5000);
  console.log("no await:" + rr);
  rr.then((rrr) => {
    console.log("then:" + rrr);
  });
  const r = await sleep(5000);
  console.log("end:" + r);
}

test();
