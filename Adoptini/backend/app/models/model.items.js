const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
},
{ 
    versionKey: false 
}
);

module.exports =  mongoose.model('item', ItemSchema)