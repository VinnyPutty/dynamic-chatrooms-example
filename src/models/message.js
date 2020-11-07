const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    name: {type: String},
    text: {type: String},
    timestamp: {type: Number}
});

module.exports = {
    MessageBuilder:  (collection = undefined)  =>  mongoose.model('Message', messageSchema, collection),
    Message: mongoose.model('Message', messageSchema)
}
