module.exports = app => {
    const { body, validationResult } = require('express-validator');
    const Router = require("express").Router();
    const conntrollerevent = require("../controllers/event.controller");
    const middleWare = require("../middleware/authenticateAdmin");



    Router.route("/add").post(middleWare.Admin,conntrollerevent.addEvent);
    Router.route("/").get(conntrollerevent.getEvents);
    Router.route("/:idEvent").get(conntrollerevent.getEvent);
    Router.route("/delete/:idEvent").delete(middleWare.Admin,conntrollerevent.deleteEvent);
    Router.route("/update/:idEvent").put(middleWare.Admin,conntrollerevent.updateEvent);
    Router.route("/verify/:idEvent").get(conntrollerevent.verifyEvent);

   

    app.use("/event", Router);
}