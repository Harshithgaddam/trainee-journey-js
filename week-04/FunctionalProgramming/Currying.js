function curry(fn) {
    return function curried(...args) {

        if (args.length >= fn.length) {
            return fn(...args);
        }

        return function (...nextArgs) {
            return curried(...args, ...nextArgs);
        };
    };
}
function multiply(a, b, c) {
    return a * b * c;
}

const curriedMultiply = curry(multiply);

console.log(curriedMultiply(2)(3)(4));
console.log(curriedMultiply(2, 3)(4));
console.log(curriedMultiply(2)(3, 4));
console.log(curriedMultiply(2, 3, 4));