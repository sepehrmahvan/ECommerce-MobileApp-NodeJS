const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const UserSchema = new Schema({
    phoneNumber: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    _id: true
});

module.exports = mongoose.model('User', UserSchema);