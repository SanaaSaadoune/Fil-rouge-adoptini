const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const eventSchema = new Schema({
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
        default: true
    },
    image: [{
        type: String,
        required: true,
        trim: true,
        minlength: 3
    }],
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

module.exports = mongoose.model('event', eventSchema);