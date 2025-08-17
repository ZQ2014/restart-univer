async function sleep(name: string, ms: number) {
  return new Promise<boolean>((resolve, reject) => {
    setTimeout(() => {
      console.log("in setTimeout", name);
      resolve(true);
    }, ms);
  });
}

const array = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

console.log(array); // [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }]

const filteredArray = array.filter((item) => item.id !== 1);

console.log(filteredArray); // [{ id: 2, name: "Bob" }]

console.log("___________________");

await sleep("sleep", 10000);
filteredArray[0].name = "Charlie";

console.log(filteredArray); // [{ id: 2, name: "Charlie" }]
console.log(array); // [{ id: 1, name: "Alice" }, { id: 2, name: "Charlie" }]
