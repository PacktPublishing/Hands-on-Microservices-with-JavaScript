let promise = Promise.resolve();

promise.then(() => console.log("planing to see this message first"));

console.log("but this message will be seen first"); 