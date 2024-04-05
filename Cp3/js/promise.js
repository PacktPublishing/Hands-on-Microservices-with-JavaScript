addPromisifiedScript("js/app.js").then(
    (resolve) => { }, //success continuation
    (reject) => { } //error handling
);

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

addPromisifiedScript("js/app.js")
    .then(() => delay(4000))
    .then(() => {
        let message = execute();
        addSuccessMessage("main", message);
    })
    .then(() => delay(3000))
    .then(() => {
        let message = "operation completed successfully";
        addSuccessMessage("main", message);
    })
    .then(() => delay(2000))
    .then(() => {
        let message = "ready for another execution";
        addSuccessMessage("main", message);
    })
    .catch((error) => addErrorMessage("main", error.message));