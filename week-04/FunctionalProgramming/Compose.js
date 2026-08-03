function compose(...fns) {
    return function (value) {
        return fns.reduceRight((acc, fn) => fn(acc), value);
    };
}
const add1 = x => x + 1;
const double = x => x * 2;
const square = x => x * x;

const result = compose(square, double, add1);

console.log(result(5));