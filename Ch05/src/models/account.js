const mongoose = require('mongoose');

const { Schema } = mongoose;

const AccountSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        number: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['root', 'sub'],
            default: 'root',
        },
        status: {
            type: String,
            enum: ['new', 'active', 'inactive', 'blocked'],
            default: 'new',
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: Date,
    },
    { optimisticConcurrency: true },
);

module.exports = mongoose.model('account', AccountSchema);