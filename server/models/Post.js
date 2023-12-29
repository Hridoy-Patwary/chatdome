const { default: mongoose } = require('mongoose');

// user schema
const Post = new mongoose.Schema({
    uid: {
        type: String,
        required: true
    },
    postTxt: String,
    privacy: String,
    time: {
        type: Date,
        default: Date.now
    }
});

module.exports = Post