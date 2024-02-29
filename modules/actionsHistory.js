const mongoose = require('mongoose');

const a = new mongoose.Schema({
    creatorRole: {
        type: String,
        required: true,
        enum: ['superAdmin', 'subAdmin', 'op']
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        required: true
    }
});

const action = mongoose.model('action', a);

module.exports = action;