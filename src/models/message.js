const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    name: {type: String},
    text: {type: String},
    timestamp: {type: Number}
});

module.exports = {
    MessageBuilder: (collection = undefined) => collection ? mongoose.model('Message', messageSchema, collection) : mongoose.model('Message', messageSchema),
    Message: mongoose.model('Message', messageSchema)
}
