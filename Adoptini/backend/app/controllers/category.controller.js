const category = require('../models/model.category');


exports.addCategory = (req, res) => {
    let categoryPush = new category({

        name: req.body.name,
    })
    categoryPush.save()
        .then(() => res.json({notification : "category added !" }))
        .catch((err) => {
            Object.values(err.errors).forEach((element) => {
                errors.push(element.message);
              });
              res.json({ errors: errors });
              console.log(err);
        })
}

exports.getCategorys = async (req, res) => {
    await category.find().then((categorys) => {
        res.status(200).json(categorys)
    }).catch((err) => {
        res.status(500).json(err)
    })
}