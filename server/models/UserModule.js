const { default: mongoose } = require('mongoose');

// user schema
const UserSchema = new mongoose.Schema({
name: String,
    bio: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    pass: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    },
    activeStatus: {
        type: Date,
        default: Date.now
    },
    verified: {
        type: Boolean,
        default: false
    },
    src: {
        type: String,
        default: '{}'
    }
});

module.exports = UserSchema