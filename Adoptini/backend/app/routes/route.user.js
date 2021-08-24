module.exports = app => {
    const Router = require("express").Router();
    const controllerUser = require("../controllers/user.controller");
    const middleWare = require("../middleware/authenticateAdmin")

    Router.route("/login").post(controllerUser.loginUser);
    Router.route("/register").post(controllerUser.registerUser);
    Router.route("/confirm/:id").get(controllerUser.verifyUser);
    Router.route("/").get(middleWare.admin, controllerUser.getUser);
    Router.route("/delete/:idUser").delete(middleWare.admin, controllerUser.deleteUser);
    Router.route("/update/:idUser").put(controllerUser.updateUser);

    app.use("/user", Router);
}