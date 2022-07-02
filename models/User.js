const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, //Every email must be unique}
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    role: { // Role of User will be admin or normal
        type: Number,
        default: 0
    },
    history: { //Order History
        type: Array,
        default: []
    }
});

module.exports = User = mongoose.model('User', UserSchema);