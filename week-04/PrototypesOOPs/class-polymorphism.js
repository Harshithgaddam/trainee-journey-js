class Shape {

    area() {
        throw new Error("area() must be implemented.");
    }

}
class Circle extends Shape {

    constructor(radius) {

        super();

        this.radius = radius;

    }

    area() {
        return Math.PI * this.radius * this.radius;
    }

}

class Rectangle extends Shape {

    constructor(width, height) {

        super();

        this.width = width;
        this.height = height;

    }

    area() {
        return this.width * this.height;
    }

}

const shapes = [

    new Circle(10),

    new Rectangle(5, 8),

    new Circle(3),

    new Rectangle(20, 2)

];

for (const shape of shapes) {

    console.log(shape.constructor.name);

    console.log(shape.area());

}