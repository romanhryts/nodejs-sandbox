class AsyncArray extends Array {
  #interval = 10;

  constructor(...args) {
    super(...args);
  }

  withInterval(ms) {
    if (typeof ms !== 'number') {
      throw new TypeError('AsyncArray.interval must be a number');
    }
    if (isNaN(ms)) {
      throw new TypeError('AsyncArray.interval cannot be NaN');
    }
    this.#interval = ms;
    return this;
  }

  asyncForEach(callback) {
    let i = 0;
    let time = Date.now();

    const call = () => {
      while (i < this.length) {
        const now = Date.now();
        if (now - time >= this.#interval) {
          time = now;
          setTimeout(call, 0);
          return;
        }
        callback(this[i], i, this);
        i++;
      }
    };

    call();
  }

  [Symbol.asyncIterator]() {
    let time = Date.now();
    let idx = 0;
    return {
      next: () => {
        const now = Date.now();
        const value = this[idx];
        const done = idx++ === this.length;
        const resolved = { value, done };
        if (now - time <= this.#interval) {
          return Promise.resolve(resolved);
        }
        time = now;
        return new Promise(resolve => {
          setTimeout(() => resolve(resolved), 0);
        });
      },
    };
  }
}

// TODO:
//  1. Add examples of the usage of both: asyncForEach and asyncIterator using for await ... of loop
//  2. Provide async API for all iterable built-in array methods, such as .map(), .reduce(), .filter() etc...