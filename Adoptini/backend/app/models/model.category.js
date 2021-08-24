const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

const categorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name category is required !'],
        trim: true,
        minlength: [3, 'Name category is too short !'],
        index: true,
        unique: true,
    },
},
    {
        versionKey: false
    }
);
categorySchema.plugin(uniqueValidator,  {message : '{PATH} category already exist !'})
module.exports = mongoose.model('category', categorySchema);