import MyPromise from "./funcMyPromise.js";
class AsyncTaskQueue {

    constructor(concurrency = 3) {
        this.concurrency = concurrency;
        this.running = 0;
        this.queue = [];
    }

    add(task) {

        return new MyPromise((resolve, reject) => {

            this.queue.push({
                task,
                resolve,
                reject
            });

            this.process();
        });
    }
    process() {

        if (this.running >= this.concurrency) {
            return;
        }

        if (this.queue.length === 0) {
            return;
        }

        const job = this.queue.shift();

        this.running++;
        let taskResult;


        try {

            taskResult = job.task();

        } catch (error) {

            this.running--;
            job.reject(error);
            this.process();

            return;
        }


        MyPromise.resolve(taskResult)

            .then(result => {

                job.resolve(result);

            })

            .catch(error => {

                job.reject(error);

            })

            .finally(() => {

                this.running--;
                this.process();

            });
    }
}
export default AsyncTaskQueue;
