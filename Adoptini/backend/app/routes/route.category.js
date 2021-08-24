module.exports = app => {
    const { body, validationResult } = require('express-validator');
    const Router = require("express").Router();
    const conntrollercategory = require("../controllers/category.controller");


    Router.route("/add").post(conntrollercategory.addCategory);
    Router.route("/").get(conntrollercategory.getCategorys);

   

    app.use("/category", Router);
}