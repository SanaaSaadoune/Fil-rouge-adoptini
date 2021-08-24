module.exports = (app) => {
  const Router = require("express").Router();
  const controllerAdmin = require("../controllers/admin.controller");
  const middleWare = require("../middleware/authenticateAdmin");
  
  Router.route("/login").post(controllerAdmin.loginAdmin);
  Router.route("/register").post(controllerAdmin.registerAdmin);
  Router.route("/confirm/:id").get(controllerAdmin.confirmAdmin);
  Router.route("/").get(middleWare.superAdmin, controllerAdmin.getAdmin);
  Router.route("/block").put(middleWare.superAdmin, controllerAdmin.blockAdmin);
  Router.route("/unblock").put(middleWare.superAdmin, controllerAdmin.UnblockAdmin);
  Router.route("/update/:idAdmin").put(middleWare.superAdmin, controllerAdmin.updateAdmin);
  app.use("/admin", Router);
};