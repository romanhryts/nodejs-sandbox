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
          setTimeout(() => {
            resolve({ value, done });
          }, 0);
        });
      },
    };
  }
}

const INTERVAL = 1;
let INTERVAL_EXECUTIONS_COUNT = 0;

const aa = new AsyncArray(10000).withInterval(INTERVAL);

