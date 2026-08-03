const FP = {

    curry(fn) {
        return function curried(...args) {
            if (args.length >= fn.length) {
                return fn(...args);
            }

            return (...nextArgs) => curried(...args, ...nextArgs);
        };
    },

    compose(...fns) {
        return value =>
            fns.reduceRight((acc, fn) => fn(acc), value);
    },

    pipe(...fns) {
        return value =>
            fns.reduce((acc, fn) => fn(acc), value);
    },

    deepFreeze(obj) {

        if (obj === null || typeof obj !== "object") {
            return obj;
        }

        Object.getOwnPropertyNames(obj).forEach(key => {
            this.deepFreeze(obj[key]);
        });

        return Object.freeze(obj);
    }
};