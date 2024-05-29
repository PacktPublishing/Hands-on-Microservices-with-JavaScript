const db = require('mongoose');

let mongoUrl;
async function connect({ mongo: { url } }) {
    mongoUrl = url;
    try {
        await db.connect(mongoUrl);
    } catch (err) {
        setTimeout(connect, 8000);
    }
}

const dbConnection = db.connection;

function disconnect() {
    dbConnection.removeAllListeners();
    return db.disconnect();
}

module.exports = {
    connect,
    disconnect,
};
