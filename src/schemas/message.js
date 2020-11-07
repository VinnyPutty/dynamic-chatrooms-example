const mongoose = require('mongoose');

var messageSchema = new mongoose.Schema({
    name:{ type: String },
    text: { type: String },
    timestamp: { type: Date }
})

module.exports = messageSchema;
