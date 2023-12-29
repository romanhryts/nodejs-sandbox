class Promisable {
  static then(onResolve, onReject = null) {
    const promise = new Promise(resolve => {
      setTimeout(() => {
        resolve({ fromPromise: true });
      }, 500);
    });
    
    return promise.then(onResolve, onReject);
  }
}

const promisable = new Promisable();

async function waitUntilPromisableResolve() {
  // async/await syntax
  // const data = await Promisable; 
  // console.log('🚀 Fulfilled:', data);

  // thenable
  // promisable.then(data => console.log('🚀 Fulfilled:', data));
}

waitUntilPromisableResolve();

console.log('Some synchronous operation.');
