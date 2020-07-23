const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: false,
        default: "off"
    },
    temp: {
        type: String,
        required: false,
        default: "0"
    },
    humid: {
        type: String,
        required: false,
        default: "0"
    },
    conc: {
        type: String,
        required: false,
        default: "0"
    }
});

module.exports = mongoose.model('Tasks', TaskSchema);