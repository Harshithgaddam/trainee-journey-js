function MyPromise(executor) {
    this.state = "pending";
    this.value = undefined;
    this.handlers = [];

    const resolve = (value) => {
        this._resolve(value);
    };

    const reject = (reason) => {
        this._reject(reason);
    };

    try {
        executor(resolve, reject);
    } catch (err) {
        reject(err);
    }
}

MyPromise.prototype._resolve = function (value) {

    if (this.state !== "pending") return;

    if (value instanceof MyPromise) {
        return value.then(
            (val) => this._resolve(val),
            (err) => this._reject(err)
        );
    }

    this.state = "fulfilled";
    this.value = value;

    this.handlers.forEach(handler => this._handle(handler));
    this.handlers = [];
};

MyPromise.prototype._reject = function (reason) {

    if (this.state !== "pending") return;

    this.state = "rejected";
    this.value = reason;

    this.handlers.forEach(handler => this._handle(handler));
    this.handlers = [];
};

MyPromise.prototype._handle = function (handler) {

    if (this.state === "pending") {
        this.handlers.push(handler);
        return;
    }

    queueMicrotask(() => {

        try {

            if (this.state === "fulfilled") {

                if (!handler.onFulfilled) {
                    handler.resolve(this.value);
                    return;
                }

                const result = handler.onFulfilled(this.value);

                if (result instanceof MyPromise) {
                    result.then(handler.resolve, handler.reject);
                } else {
                    handler.resolve(result);
                }

            } else {

                if (!handler.onRejected) {
                    handler.reject(this.value);
                    return;
                }

                const result = handler.onRejected(this.value);

                if (result instanceof MyPromise) {
                    result.then(handler.resolve, handler.reject);
                } else {
                    handler.resolve(result);
                }
            }

        } catch (err) {
            handler.reject(err);
        }

    });
};

MyPromise.prototype.then = function (onFulfilled, onRejected) {

    return new MyPromise((resolve, reject) => {

        this._handle({
            onFulfilled,
            onRejected,
            resolve,
            reject
        });

    });
};

MyPromise.prototype.catch = function (onRejected) {

    return this.then(null, onRejected);

};

MyPromise.prototype.finally = function (callback) {

    return this.then(

        (value) => {
            callback();
            return value;
        },

        (reason) => {
            callback();
            throw reason;
        }

    );

};

MyPromise.resolve = function (value) {

    return new MyPromise((resolve) => {

        resolve(value);

    });

};

MyPromise.reject = function (reason) {

    return new MyPromise((_, reject) => {

        reject(reason);

    });

};

console.log("Example 1");

new MyPromise((resolve) => {
    resolve("Hello World");
})

.then(value => {
    console.log(value);
});

setTimeout(() => {

console.log("Example 2");

MyPromise.resolve(10)

.then(value => {
    console.log(value);
    return value + 5;
})

.then(value => {
    console.log(value);
    return value * 2;
})

.then(value => {
    console.log(value);
});


},1000);

setTimeout(() => {

console.log("Example 3");

MyPromise.resolve(5)

.then(value => {

    return new MyPromise(resolve => {

        setTimeout(() => {

            resolve(value * 10);

        },1000);

    });

})

.then(value => {

    console.log(value);

});

},2500);

setTimeout(() => {

console.log("Example 4");

MyPromise.resolve(20)

.then(value => {

    throw new Error("Calculation failed");

})

.catch(error => {

    console.log(error.message);

});

},5000);

setTimeout(() => {

console.log("Example 5");

MyPromise.resolve("Downloaded")

.finally(() => {

    console.log("Cleaning resources");

})

.then(value => {

    console.log(value);

});

},6500);

setTimeout(() => {

console.log("Example 6");

const promise = new MyPromise(resolve => {

    setTimeout(() => {

        resolve("Done");

    },1000);

});

promise.then(value => {
    console.log("A:", value);
});

promise.then(value => {
    console.log("B:", value);
});

promise.then(value => {
    console.log("C:", value);
});

},8000);