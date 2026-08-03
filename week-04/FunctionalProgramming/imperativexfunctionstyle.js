//example1
//imperative script
const users = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 17 },
    { name: "Charlie", age: 30 }
];

const result = [];

for (let i = 0; i < users.length; i++) {
    if (users[i].age >= 18) {
        result.push(users[i].name.toUpperCase());
    }
}

console.log(result);
//function-style
const result = users
    .filter(user => user.age >= 18)
    .map(user => user.name.toUpperCase());

console.log(result);

//example2
//imperative style
const cart = [
    { price: 100, quantity: 2 },
    { price: 50, quantity: 4 },
    { price: 200, quantity: 1 }
];

let total = 0;

for (const item of cart) {
    total += item.price * item.quantity;
}

console.log(total);

const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
);

console.log(total);