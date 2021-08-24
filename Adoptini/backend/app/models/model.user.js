const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
var uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new Schema({
    fullname: {
        type: String,
        required: [true, "Full name is required !"],
        trim: true,
        minlength: [6, "Full name is too short !"],
        match: [/^([a-zA-Z'-.]+ [a-zA-Z'-.]+)$/i, "full name should be alphabets and space"]
    },
    email: {
        type: String,
        required: [true, 'email is required !'],
        trim: true,
        minlength: [3, 'email is too short'],
        unique: true,
        index: true,
        validate: [validator.isEmail, 'invalid email try another email !']
    },
    password: {
        type: String,
        required: [true, 'password is required !'],
        trim: true,
        minlength: 3,
    },
    photo: {
        type: String,
        required: true,
        trim: true,
    },
    adresse: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    cin: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    rib: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    status: {
        type: Boolean,
        default: false,
    },
}, {
    versionKey: false
});
UserSchema.plugin(uniqueValidator, {
    message: '{PATH} already exist !'
})

module.exports = mongoose.model('User', UserSchema);