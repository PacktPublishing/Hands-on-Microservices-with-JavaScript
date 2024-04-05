async function getData() {
    const response = await fetch(url.concat(paths[0]));
    const data = await response.json();
    console.log(data);
}

Promise.all(paths.map((path) => fetch(url.concat(path)).then(response => response.json())))
    .then(data => {
        console.log(data);
    });

let promises = Promise.all(paths.map(path => fetch(url.concat(path))));
promises.then(responses => Promise.all(responses.map(t => t.json())))
    .then(data => {
        data.forEach(element => {
            console.log(element);
        });
    })