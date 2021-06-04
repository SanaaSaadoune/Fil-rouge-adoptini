const express = require('express');
const router = express.Router();

const authentification = require('../middleware/authentification');

const ItemController = require('../controllers/controller.items');

//get all items
// router.get('/', authentification.user, ItemController.getAllItems);
router.get('/', ItemController.getAllItems);

//get specific item
// router.get('/:id', authentification.user, ItemController.getSpecificItem)
router.get('/:id', ItemController.getSpecificItem)

//add item
// router.post('/add', authentification.user, ItemController.createItem);
router.post('/add', ItemController.createItem);

//update item
// router.put('/update/:id', authentification.user, ItemController.updateItem);
router.put('/update/:id', ItemController.updateItem);

//delete item
// router.delete('/delete/:id', authentification.user, ItemController.deleteItem);
router.delete('/delete/:id', ItemController.deleteItem);


module.exports= router;