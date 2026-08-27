type PromiseState = "pending" | "fulfilled" | "rejected";

type Resolve<T> = (value: T | MyPromise<T>) => void;
type Reject = (reason?: any) => void;

type OnFulfilled<T, TResult> = ((value: T) => TResult | MyPromise<TResult>) | null | undefined;
type OnRejected<TResult> = ((reason: any) => TResult | MyPromise<TResult>) | null | undefined;

interface PromiseHandler<T, TResult1 = any, TResult2 = any> {
  onFulfilled: OnFulfilled<T, TResult1>;
  onRejected: OnRejected<TResult2>;
  resolve: Resolve<TResult1 | TResult2>;
  reject: Reject;
}

export type PromiseSettledResult<T> =
  | { status: "fulfilled"; value: T }
  | { status: "rejected"; reason: any };

export class MyPromise<T> {
  private state: PromiseState = "pending";
  private value: any = undefined;
  private handlers: PromiseHandler<T>[] = [];

  constructor(
    executor: (resolve: Resolve<T>, reject: Reject) => void
  ) {
    const resolve: Resolve<T> = (value) => {
      this._resolve(value);
    };

    const reject: Reject = (reason) => {
      this._reject(reason);
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  private _resolve(value: T | MyPromise<T>): void {
    if (this.state !== "pending") return;

    if (value instanceof MyPromise) {
      value.then(
        (val) => this._resolve(val),
        (err) => this._reject(err)
      );
      return;
    }

    this.state = "fulfilled";
    this.value = value;

    this.handlers.forEach((handler) => this._handle(handler));
    this.handlers = [];
  }

  private _reject(reason: any): void {
    if (this.state !== "pending") return;

    this.state = "rejected";
    this.value = reason;

    this.handlers.forEach((handler) => this._handle(handler));
    this.handlers = [];
  }

  private _handle(handler: PromiseHandler<T>): void {
    if (this.state === "pending") {
      this.handlers.push(handler);
      return;
    }

    queueMicrotask(() => {
      try {
        if (this.state === "fulfilled") {
          if (!handler.onFulfilled) {
            handler.resolve(this.value);
            return;
          }

          const result = handler.onFulfilled(this.value);

          if (result instanceof MyPromise) {
            result.then(handler.resolve, handler.reject);
          } else {
            handler.resolve(result);
          }
        } else {
          if (!handler.onRejected) {
            handler.reject(this.value);
            return;
          }

          const result = handler.onRejected(this.value);

          if (result instanceof MyPromise) {
            result.then(handler.resolve, handler.reject);
          } else {
            handler.resolve(result);
          }
        }
      } catch (err) {
        handler.reject(err);
      }
    });
  }

  then<TResult1 = T, TResult2 = never>(
    onFulfilled?: OnFulfilled<T, TResult1>,
    onRejected?: OnRejected<TResult2>
  ): MyPromise<TResult1 | TResult2> {
    return new MyPromise((resolve, reject) => {
      this._handle({
        onFulfilled,
        onRejected,
        resolve,
        reject
      });
    });
  }

  catch<TResult = never>(
    onRejected?: OnRejected<TResult>
  ): MyPromise<T | TResult> {
    return this.then(null, onRejected);
  }

  finally(callback: () => void): MyPromise<T> {
    return this.then(
      (value) => {
        callback();
        return value;
      },
      (reason) => {
        callback();
        throw reason;
      }
    );
  }

  static resolve(): MyPromise<void>;
  static resolve<T>(value: T | MyPromise<T>): MyPromise<T>;
  static resolve<T>(value?: T | MyPromise<T>): MyPromise<T | void> {
    if (value instanceof MyPromise) {
        return value as MyPromise<T>;
    }
    return new MyPromise((resolve) => resolve(value as T));
  }

  static reject<T = never>(reason?: any): MyPromise<T> {
    return new MyPromise((_, reject) => reject(reason));
  }
}
export default MyPromise;