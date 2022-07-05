const myModule = require("./myOtherFile.js");
// console.log(myModule.name);
console.log("Counter = ", myModule.getCounter());
myModule.inc();
myModule.inc();
myModule.inc();
console.log("Counter = ", myModule.getCounter());