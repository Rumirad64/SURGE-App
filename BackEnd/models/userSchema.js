const mongoose = require('mongoose');
const validator = require('validator');
const argon2 = require('argon2');

//import all monogoose types
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        unique: true
    },
    password: {
        type: Schema.Types.Mixed,
        required: true,
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    phone : {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 12
    }
});
const UserSchema = mongoose.model("User",userSchema);



module.exports = UserSchema; 