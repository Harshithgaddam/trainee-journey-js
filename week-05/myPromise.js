class MyPromise {
    constructor(executor) {
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

    _resolve(value) {
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
    }

    _reject(reason) {
        if (this.state !== "pending") return;

        this.state = "rejected";
        this.value = reason;

        this.handlers.forEach(handler => this._handle(handler));
        this.handlers = [];
    }

    _handle(handler) {
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
    }

    then(onFulfilled, onRejected) {
        return new MyPromise((resolve, reject) => {
            this._handle({
                onFulfilled,
                onRejected,
                resolve,
                reject
            });
        });
    }

    catch(onRejected) {
        return this.then(null, onRejected);
    }

    finally(callback) {
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
    }

    static resolve(value) {
        return new MyPromise(resolve => resolve(value));
    }

    static reject(reason) {
        return new MyPromise((_, reject) => reject(reason));
    }
}
export default MyPromise;