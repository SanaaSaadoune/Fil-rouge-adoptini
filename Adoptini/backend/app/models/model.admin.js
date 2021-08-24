const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require('validator');
var uniqueValidator = require('mongoose-unique-validator');

const AdminSchema = new Schema(
  {
    superAdmin: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: false,
    },
    fullname: {
      type: String,
      required: [true, "Full name is required !"],
      trim: true,
      minlength: [6, "Full name is too short !"],
      match  : [/^([a-zA-Z'-.]+ [a-zA-Z'-.]+)$/i, "full name should be alphabets and space"]
    },
    email: {
      type: String,
      required: [true, 'email is required !'],
      trim: true,
      minlength: [3, 'email is too short'],
      unique: true,
      index: true,
      validate : [validator.isEmail, 'invalid email try another email !']
    },
    ban: {
      type: Boolean,
      default : false
    },
    password: {
      type: String,
      required: [true, 'password is required !'],
      trim: true,
      minlength: 3,
    },
    phone: {
      type: String,
      required: [true, 'phone number is required'],
      trim: true,
      minlength: [10, 'phone number is too short !'],
      index : true,
      unique: true,
      match : [/^(0)([ \-_/]*)(\d[ \-_/]*){9}$/g, 'provide a valid phone']
    },
  },
  {
    versionKey: false,
  }
);
AdminSchema.plugin(uniqueValidator,  {message : '{PATH} already exist !'})
module.exports = mongoose.model("Admin", AdminSchema, "admins");
