const Item = require('../models/model.items');
const winston = require('winston');

const logConfiguration = {
    'transports': [
        new winston.transports.File({
            filename: 'logs/logs.log'
        })
    ]
}
const logger = winston.createLogger(logConfiguration)

//get all items
exports.getAllItems = async (req,res) =>{
    Item.find()
        .sort({date:-1}) //trier par date ordre décroissant
        .then(items => res.status(200).json(items))
        .catch(err => res.json(err))
};

//get specific item
exports.getSpecificItem = async (req,res) =>{
    await Item.findById(req.params.id)
        .then(item => res.json({ item}))
        .catch(error => res.json({ message : error}))
};

//add item
exports.createItem =  async (req,res) =>{
    const newItem = new Item({
        //name: req.body.name
        ...req.body
    });
    await newItem.save()
        .then(() => {
            res.status(201).json({ message: 'Item created succesfully !'})
            var newDate = new Date();
            logger.info(newDate.toLocaleDateString()+' - '+newDate.toLocaleTimeString()+' - '+'Adding item name :'+ req.body.name)

        }).catch((err) => res.status(400).json({ err }));
};

//update item
exports.updateItem = async (req,res) =>{
    await Item.updateOne({_id: req.params.id} , { ...req.body, _id: req.params.id})
        .then(() => res.status(200).json({ message: 'Item modified succesfully !'}))
        .catch(err => res.status(400).json({ err }));
};

//delete item
exports.deleteItem = async (req,res) =>{
    await Item.deleteOne({ _id: req.params.id})
        .then(() => res.status(200).json({ message: 'Item removed succesfully !'}))
        .catch(err => res.status(400).json({ err }));
};
