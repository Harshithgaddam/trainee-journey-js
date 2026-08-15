import MyPromise from "./funcMyPromise.js";
import AsyncTaskQueue from "./asyncTaskQueue.js";
function fakeApi(name) {

    return new MyPromise((resolve, reject) => {

        const time =Math.floor(Math.random() * 3000) + 1000;


        console.log(`${name} started`);


        setTimeout(() => {
            const failed = Math.random() < 0.2;


            if (failed) {

                console.log(`${name} failed`);

                reject(`${name} error`);

                return;
            }


            console.log(`${name} finished`);

            resolve(`${name} result`);

        }, time);

    });
}

const queue = new AsyncTaskQueue(3);

queue.add(() => fakeApi("API 1"))
    .then(result => console.log("Result:", result))
    .catch(error => console.log("Error:", error));


queue.add(() => fakeApi("API 2"))
    .then(result => console.log("Result:", result))
    .catch(error => console.log("Error:", error));


queue.add(() => fakeApi("API 3"))
    .then(result => console.log("Result:", result))
    .catch(error => console.log("Error:", error));


queue.add(() => fakeApi("API 4"))
    .then(result => console.log("Result:", result))
    .catch(error => console.log("Error:", error));


queue.add(() => fakeApi("API 5"))
    .then(result => console.log("Result:", result))
    .catch(error => console.log("Error:", error));


queue.add(() => fakeApi("API 6"))
    .then(result => console.log("Result:", result))
    .catch(error => console.log("Error:", error));