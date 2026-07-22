console.log("1");

setTimeout(() => {
    console.log("2");

    Promise.resolve().then(() => {
        console.log("3");
    });
    for(let i=0;i<3;i++){
        console.log("Inside SetTimeOut",i);
    }

}, 0);

Promise.resolve().then(() => {
    console.log("4");
});

console.log("5");