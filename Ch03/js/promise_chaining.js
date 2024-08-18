addScriptPromisified("js/app.js")
    .then(() =>
        new Promise((resolve) => {
            setTimeout(() => {
                let message = execute();
                addSuccessMessage("main", message);
                resolve();
            }, 4000);
        })
    )
    .then(() =>
        new Promise((resolve) => {
            setTimeout(() => {
                let message = "operation completed successfully";
                addSuccessMessage("main", message);
                resolve();
            }, 3000);
        })
    )
    .then(() =>
        new Promise((resolve) => {
            setTimeout(() => {
                let message = "ready for another execution";
                addSuccessMessage("main", message);
                resolve();
            }, 2000);
        })
    )
    .catch((error) => addErrorMessage("main", error.message));
