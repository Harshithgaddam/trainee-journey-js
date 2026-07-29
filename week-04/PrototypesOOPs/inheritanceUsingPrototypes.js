// Parent Constructor
function Person(name, age) {
    console.log("Person constructor called");

    this.name = name;
    this.age = age;
}

// Shared Method
Person.prototype.introduce = function () {
    console.log(`Hi, I'm ${this.name} and I'm ${this.age} years old.`);
};

// Child Constructor
function Employee(name, age, salary) {

    console.log("Employee constructor called");
    Person.call(this, name, age);
    this.salary = salary;
}

// This is the main line where connection between child and parent happens
Employee.prototype = Object.create(Person.prototype);
Employee.prototype.constructor = Employee;

// Child Method
Employee.prototype.work = function () {
    console.log(`${this.name} earns $${this.salary}`);
};

// Testing
const emp = new Employee("Harshith", 21, 50000);

console.log(emp);

emp.introduce();
emp.work();

console.log(emp instanceof Employee);
console.log(emp instanceof Person);
console.log(emp.constructor);