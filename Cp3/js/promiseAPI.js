Promise.all([
  new Promise((resolve, reject) => setTimeout(() => resolve("success resolve"), 500)),
  new Promise((resolve, reject) => setTimeout(() => reject(new Error("Something went wrong!!")), 1000)),
  new Promise((resolve, reject) => setTimeout(() => resolve("another success resolve"), 1500))
])
  .then((success) => console.log(success))
  .catch(alert); // Error: Something went wrong!!

Promise.allSettled([
  new Promise((resolve, reject) => setTimeout(() => resolve("success resolve"), 500)),
  new Promise((resolve, reject) => setTimeout(() => reject(new Error("Something went wrong!!")), 1000)),
  new Promise((resolve, reject) => setTimeout(() => resolve("another success resolve"), 1500))
])
  .then(results => {
    // 'results' is an array containing information about each promise (resolved or rejected)
    console.log(results);  // Use console.log to see the results instead of .catch(alert)
  });


Promise.race([
  new Promise((resolve, reject) => setTimeout(() => resolve("success resolve"), 2500)),
  new Promise((resolve, reject) => setTimeout(() => reject(new Error("Something went wrong!!")), 1000)),
  new Promise((resolve, reject) => setTimeout(() => resolve("another success resolve"), 3500))
])
  .then(result => {
    console.log(result);
  }).catch((err) => console.log('Error detected', err));


Promise.any([
  new Promise((resolve, reject) => setTimeout(() => resolve("success resolve"), 2500)),
  new Promise((resolve, reject) => setTimeout(() => reject(new Error("Something went wrong!!")), 1000)),
  new Promise((resolve, reject) => setTimeout(() => resolve("another success resolve"), 3500))
])
  .then(result => {
    console.log(result);
  }).catch((err) => console.log('Error detected', err));//will not be executed