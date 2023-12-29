const { default: mongoose } = require('mongoose');


const Message = new mongoose.Schema({
    senderID: {
        type: String,
        required: true
    },
    receiverID: {
        type: String,
        required: true
    },
    msg: {
        type: String,
        required: true
    },
    stage: {
        type: String,
        default: 'sending'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})

module.exports = Message