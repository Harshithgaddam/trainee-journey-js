import MyPromise from "./funcMyPromise.js";
async function compare(myPromise, nativePromise) {

    try {

        const myResult = await myPromise;

        console.log("MyPromise:", myResult);

    } catch (error) {

        console.log("MyPromise rejected:");

    }


    try {

        const nativeResult = await nativePromise;

        console.log("Native Promise:", nativeResult);

    } catch (error) {

        console.log("Native Promise rejected:");

    }
}



// Example 1
await compare(

    new MyPromise(resolve => {

        resolve("Hello World");

    }),

    new Promise(resolve => {

        resolve("Hello World");

    })
);


// Example 2
await compare(
   
    MyPromise.resolve(10)

        .then(value => {

            return value + 5;

        })

        .then(value => {

            return value * 2;

        }),

    Promise.resolve(10)

        .then(value => {

            return value + 5;

        })

        .then(value => {

            return value * 2;

        })
);


// Example 3

await compare(
    

    MyPromise.resolve(5)

        .then(value => {

            return new MyPromise(resolve => {

                setTimeout(() => {

                    resolve(value * 10);

                }, 500);

            });

        }),

    Promise.resolve(5)

        .then(value => {

            return new Promise(resolve => {

                setTimeout(() => {

                    resolve(value * 10);

                }, 500);

            });

        })
);

// Example 4
await compare(
   

    MyPromise.resolve(20)

        .then(() => {

            throw new Error("Calculation failed");

        })

        .catch(error => {

            return error.message;

        }),

    Promise.resolve(20)

        .then(() => {

            throw new Error("Calculation failed");

        })

        .catch(error => {

            return error.message;

        })
);

// Example 5
await compare(

    MyPromise.resolve("Downloaded")

        .finally(() => {

            console.log("MyPromise cleanup");

        }),

    Promise.resolve("Downloaded")

        .finally(() => {

            console.log("Native Promise cleanup");

        })
);



// Example 6
const myPromise = new MyPromise(resolve => {

    setTimeout(() => {

        resolve("Done");

    }, 500);

});


const nativePromise = new Promise(resolve => {

    setTimeout(() => {

        resolve("Done");

    }, 500);

});


myPromise.then(value => {

    console.log("MyPromise A:", value);

});

myPromise.then(value => {

    console.log("MyPromise B:", value);

});

myPromise.then(value => {

    console.log("MyPromise C:", value);


});


nativePromise.then(value => {

    console.log("Native A:", value);

});

nativePromise.then(value => {

    console.log("Native B:", value);

});

nativePromise.then(value => {

    console.log("Native C:", value);

});


await myPromise;
await nativePromise;


// Example 7

await compare(
    

    MyPromise.all([

        MyPromise.resolve(10),

        MyPromise.resolve(20),

        MyPromise.resolve(30)

    ]),

    Promise.all([

        Promise.resolve(10),

        Promise.resolve(20),

        Promise.resolve(30)

    ])
);


// Example 8

await compare(
   

    MyPromise.all([

        MyPromise.resolve(10),

        MyPromise.reject("Error"),

        MyPromise.resolve(30)

    ]),

    Promise.all([

        Promise.resolve(10),

        Promise.reject("Error"),

        Promise.resolve(30)

    ])
);


// Example 9


await compare(

    MyPromise.allSettled([

        MyPromise.resolve(10),

        MyPromise.reject("Failed"),

        MyPromise.resolve(30)

    ]),

    Promise.allSettled([

        Promise.resolve(10),

        Promise.reject("Failed"),

        Promise.resolve(30)

    ])
);


// Example 10
await compare(

    MyPromise.race([

        new MyPromise(resolve => {

            setTimeout(() => {

                resolve("Slow");

            }, 100);

        }),

        new MyPromise(resolve => {

            setTimeout(() => {

                resolve("Fast");

            }, 50);

        })

    ]),

    Promise.race([

        new Promise(resolve => {

            setTimeout(() => {

                resolve("Slow");

            }, 100);

        }),

        new Promise(resolve => {

            setTimeout(() => {

                resolve("Fast");

            }, 50);

        })

    ])
);
// Example 11
await compare(
    
    MyPromise.any([

        MyPromise.reject("Error 1"),

        MyPromise.resolve("Success"),

        MyPromise.reject("Error 2")

    ]),

    Promise.any([

        Promise.reject("Error 1"),

        Promise.resolve("Success"),

        Promise.reject("Error 2")

    ])
);
// Example 12
await compare(
    

    MyPromise.any([

        MyPromise.reject("Error 1"),

        MyPromise.reject("Error 2"),

        MyPromise.reject("Error 3")

    ]),

    Promise.any([

        Promise.reject("Error 1"),

        Promise.reject("Error 2"),

        Promise.reject("Error 3")

    ])
);
// Example 13
await compare(
    new MyPromise(resolve => {

        resolve(
            MyPromise.resolve(100)
        );

    }),

    new Promise(resolve => {

        resolve(
            Promise.resolve(100)
        );

    })
);

// Example 14
await compare(

    new MyPromise(() => {

        throw new Error("Executor failed");

    }),

    new Promise(() => {

        throw new Error("Executor failed");

    })
);
