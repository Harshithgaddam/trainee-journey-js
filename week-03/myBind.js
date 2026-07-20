Function.prototype.myBind = function (context, ...args) {

    const originalFunction = this;

    return function (...newArgs) {

        return originalFunction.apply(context, [...args, ...newArgs]);

    };

};

// Test
function greet(city) {
    console.log(`Hello, I'm ${this.name} from ${city}`);
}

const person = {
    name: "Harshith"
};

const boundFunction = greet.myBind(person);

boundFunction("Hyderabad");