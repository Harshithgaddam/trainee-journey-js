function createCounter() {

    let count = 0;

    return {
 
        increment() {
            count++;
            console.log(count);
        },

        decrement() {
            count--;
            console.log(count);
        },

        reset() {
            count = 0;
            console.log(count);
        }
    };
}

const counter = createCounter();

counter.increment();
counter.increment();
counter.decrement();
counter.reset();