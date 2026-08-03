function pipe(...fns) {
    return function (value) {
        return fns.reduce((acc, fn) => fn(acc), value);
    };
}
const add1 = x => x + 1;
const double = x => x * 2;
const square = x => x * x;

const result = pipe(add1, double, square);

console.log(result(5));