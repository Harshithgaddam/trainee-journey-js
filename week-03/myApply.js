Function.prototype.myApply = function (context, args = []) {
    context = context || globalThis;

    const uniqueKey = Symbol();

    context[uniqueKey] = this;

    const result = context[uniqueKey](...args);

    delete context[uniqueKey];

    return result;
};

// Test
function greet(city, country) {
    console.log(`Hello, I'm ${this.name} from ${city}, ${country}`);
}

const person = {
    name: "Harshith"
};

greet.myApply(person, ["Hyderabad", "India"]);