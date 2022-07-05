// let hello = "Hello CoSSE280!";
// for (let index = 0; index < 10; index++) {
//     setTimeout(() => {
//         console.log(index, hello);
//     }, index*1000);
// }

let cnt = 0;
setInterval(() => {
    cnt++;
    console.log("counter", cnt);
}, 500);