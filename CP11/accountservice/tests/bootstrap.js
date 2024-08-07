// todo: mock DB
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { beforeAll, afterAll } = require('jest');
let mongoDb;

beforeAll(async () => {
    mongoDb = await MongoMemoryServer.create();
    const uri = mongoDb.getUri();

    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoDb.stop();
});

afterEach(async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];

        await collection.deleteMany();
    }
});