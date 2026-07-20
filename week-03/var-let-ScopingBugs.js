
// Bug 1: var vs let in for loop
console.log("----- Bug 1: var vs let in setTimeout -----");

// Using var
for (var i = 1; i <= 3; i++) {
    setTimeout(() => {
        console.log("Using var:", i); // 4 4 4
    }, 1000);
}

// Using let
for (let j = 1; j <= 3; j++) {
    setTimeout(() => {
        console.log("Using let:", j); // 1 2 3
    }, 1000);
}


// Bug 2: Block Scope

console.log("\n----- Bug 2: Block Scope -----");

// var ignores block scope
if (true) {
    var message = "Hello";
}

console.log("Using var:", message); // Hello

// let is block scoped
if (true) {
    let greeting = "Hello";
}

// console.log(greeting); // ReferenceError


// Bug 3: Variable Shadowing

console.log("\n----- Bug 3: Variable Shadowing -----");

// Variable Shadowing with var
var count = 10;

if (true) {
    var count = 20;  // var overwrites the outer variable
}

console.log("Using var:", count); // 20

// Variable Shadowing with let
let total = 10;

if (true) {
    let total = 20; // let creates a new variable inside the block
}

console.log("Using let:", total); // 10