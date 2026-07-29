function Shape() {}

Shape.prototype.area = function () {
    throw new Error("area() must be implemented.");
};
function Circle(radius) {
    this.radius = radius;
}

Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.area = function () {
    return Math.PI * this.radius * this.radius;
};

function Rectangle(width, height) {
    this.width = width;
    this.height = height;
}

Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.area = function () {
    return this.width * this.height;
};

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