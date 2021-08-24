module.exports = app => {
    const { body, validationResult } = require('express-validator');
    const Router = require("express").Router();
    const conntrollerpost = require("../controllers/post.controller");


    Router.route("/add").post(conntrollerpost.addPost);
    Router.route("/").get(conntrollerpost.getPosts);
    Router.route("/:idPost").get(conntrollerpost.getPost);
    Router.route("/delete/:idPost").delete(conntrollerpost.deletePost);
    Router.route("/update/:idPost").put(conntrollerpost.updatePost);
    Router.route("/verify/:idPost").get(conntrollerpost.verifyPost);

   

    app.use("/post", Router);
}