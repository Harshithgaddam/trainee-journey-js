Function.prototype.myCall = function (context, ...args) {
    context = context || globalThis;

    const uniqueKey = Symbol();

    context[uniqueKey] = this;

    const result = context[uniqueKey](...args);

    delete context[uniqueKey];

    return result;
};

// Test
function greet(city) {
    console.log(`Hello, I'm ${this.name} from ${city}`);
}

const person = {
    name: "Harshith"
};

greet.myCall(person, "Hyderabad");