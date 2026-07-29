class Person {

    constructor(name, age) {

        console.log("Person constructor called");

        this.name = name;
        this.age = age;
    }

    introduce() {
        console.log(`Hi, I'm ${this.name} and I'm ${this.age} years old.`);
    }

}
// Child Class
class Employee extends Person {

    constructor(name, age, salary) {

        console.log("Employee constructor called");
        super(name, age);

        this.salary = salary;

    }

    work() {
        console.log(`${this.name} earns $${this.salary}`);
    }

}
// Testing
const emp = new Employee("Harshith", 21, 50000);

console.log(emp);
emp.introduce();
emp.work();

console.log(emp instanceof Employee);
console.log(emp instanceof Person);
console.log(emp.constructor);