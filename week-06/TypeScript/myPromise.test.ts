import MyPromise from './MyPromise';

describe('MyPromise', () => {
  it('should fulfill with a value asynchronously', async () => {
    const promise = new MyPromise<string>((resolve) => {
      setTimeout(() => resolve('success'), 10);
    });

    const result = await promise;
    expect(result).toBe('success');
  });

  it('should reject with a reason asynchronously', async () => {
    const error = new Error('fail');
    const promise = new MyPromise<string>((_, reject) => {
      setTimeout(() => reject(error), 10);
    });

    await expect(promise).rejects.toThrow('fail');
  });

  it('should handle chaining via .then() and transform values', async () => {
    const promise = MyPromise.resolve(2).then((val :number) => val * 3);
    const result = await promise;
    expect(result).toBe(6);
  });

  it('should catch rejections using .catch()', async () => {
    const promise = MyPromise.reject('boom').catch((err) => {
      return `caught ${err}`;
    });

    const result = await promise;
    expect(result).toBe('caught boom');
  });

  it('should execute .finally() callbacks on fulfillment and rejection', async () => {
    let finallyCalledCount = 0;
    const callback = () => {
      finallyCalledCount++;
    };

    await MyPromise.resolve('ok').finally(callback);
    await MyPromise.reject('err').catch(() => {}).finally(callback);

    expect(finallyCalledCount).toBe(2);
  });

  it('should unwrap nested MyPromise instances correctly in resolve', async () => {
    const innerPromise = MyPromise.resolve('nested success');
    const outerPromise = MyPromise.resolve(innerPromise);

    const result = await outerPromise;
    expect(result).toBe('nested success');
  });

  it('should catch synchronous errors thrown inside executor', async () => {
    const promise = new MyPromise(() => {
      throw new Error('sync crash');
    });

    await expect(promise).rejects.toThrow('sync crash');
  });



  it('should resolve nested MyPromise inside executor _resolve branch', async () => {
    const inner = new MyPromise((resolve) => setTimeout(() => resolve('inner val'), 10));
    const outer = new MyPromise((resolve) => resolve(inner));

    const result = await outer;
    expect(result).toBe('inner val');
  });

  it('should reject nested MyPromise inside executor _resolve branch', async () => {
    const inner = MyPromise.reject('inner fail');
    const outer = new MyPromise((resolve) => resolve(inner));

    await expect(outer).rejects.toBe('inner fail');
  });

  it('should passthrough value when onFulfilled is not provided', async () => {
    const result = await MyPromise.resolve('passthrough').then(null);
    expect(result).toBe('passthrough');
  });

  it('should passthrough rejection when onRejected is not provided', async () => {
    await expect(MyPromise.reject('fail passthrough').then((x) => x)).rejects.toBe('fail passthrough');
  });

  it('should unwrap returned MyPromise inside .then() and .catch() handlers', async () => {
    const fulfilledChain = await MyPromise.resolve('step 1').then((val) => MyPromise.resolve(`${val} -> step 2`));
    expect(fulfilledChain).toBe('step 1 -> step 2');

    const rejectedChain = await MyPromise.reject('err').catch(() => MyPromise.resolve('recovered'));
    expect(rejectedChain).toBe('recovered');
  });

  it('should catch exceptions thrown inside .then() and .catch() handlers', async () => {
    const p1 = MyPromise.resolve('ok').then(() => {
      throw new Error('boom then');
    });
    await expect(p1).rejects.toThrow('boom then');

    const p2 = MyPromise.reject('fail').catch(() => {
      throw new Error('boom catch');
    });
    await expect(p2).rejects.toThrow('boom catch');
  });

  it('should resolve undefined when MyPromise.resolve() is called without arguments', async () => {
    const emptyPromise = MyPromise.resolve();
    const result = await emptyPromise;
    expect(result).toBeUndefined();
  });

  it('should rethrow rejection error in .finally() when promise rejects', async () => {
    const p = MyPromise.reject('final error').finally(() => {});
    await expect(p).rejects.toBe('final error');
  });
});