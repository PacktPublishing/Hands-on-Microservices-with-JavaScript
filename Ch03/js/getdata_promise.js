const url = "https://jsonplaceholder.typicode.com";

const paths = ["/posts", "/comments"];

let getData = async function () {
    const responses = await Promise.all(paths.map(path => fetch(url.concat(path))));
    const jsons = await Promise.all(responses.map(response => response.json()));
    jsons.forEach(element => {
        console.log(element);
    });

}
getData();

let promises = Promise.all(paths.map(path => fetch(url.concat(path))));
promises.then(responses => Promise.all(responses.map(t => t.json())))
    .then(data => {
        data.forEach(element => {
            console.log(element);
        });
    })

