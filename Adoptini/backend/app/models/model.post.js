const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    donAmount: {
        type: Number,
        required: true,
        trim: true
    },
    status: {
        type: Boolean,
        default: false
    },
    image: [{
        type: String,
        required: true,
        trim: true,
        minlength: 3
    }],
    idCategorie: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "category",
        minlength: 3
    },
    file: {
        type: String,
        required: true,
        trim: true,
    },
    donSuccess: [
        {
        donorname: {
                type: String,
                required: true,
                trim: true
        },
        donation: {
                type: Number,
                required: true,
                trim: true
            }
        }
    ]
}, {
    versionKey: false
});

module.exports = mongoose.model('post', postSchema);