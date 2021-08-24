const Admin = require("../models/model.admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../configs/jwt.config");
const nodemailer = require("../configs/nodemailer.config");



exports.loginAdmin = (req, res) => {
  let errors = [];
  const { email, password } = req.body;
  Admin.findOne({ email: email })
    .then((admin) => {
      if (admin == null) {
        errors.push("email not found !");
        res.json({ error: errors });
        return;
      }
      var passwordIsValid = bcrypt.compareSync(password, admin.password);
      if (!passwordIsValid) {
        errors.push("credential error !");
        return res.json({ error: errors });
      } else if (admin.status === false) {
        errors.push("check your mail for an activation link !");
        return res.json({ error: errors });
      }
      else if (admin.ban === true) {
        errors.push("you are banned !");
        return res.json({ error: errors });
      }
      else {
        var token = jwt.sign(
          {
            id: admin._id,
            superAdmin: admin.superAdmin,
            admin: true,
          },
          config.secret,
          {
            expiresIn: 86400,
          }
        );
        res.status(200).send({
          auth: true,
          token: token,
        });
      }
    })
    .catch((err) => {
      if (err) return res.status(500).send("Error server.");
    });
};

exports.registerAdmin = (req, res) => {
  let errors = [];

  const { fullName, email, password, phone } = req.body;

  let adminPush = new Admin({
    fullname: fullName,
    email: email,
    password: bcrypt.hashSync(password, 10),
    phone: phone,
  });
  adminPush
    .save()
    .then((data) => {
      nodemailer.sendConfirmationEmail(fullName, email, data._id, "admin");
      res.json(data);
    })
    .catch((err) => {
      Object.values(err.errors).forEach((element) => {
        errors.push(element.message);
      });
      res.json({ errors: errors });
      console.log(err);
    });
};

exports.confirmAdmin = (req, res) => {
  let errors = [];
  Admin.findOne({_id : req.params.id }).then((data) => {
    if (data == null) {
      errors.push("error was found !");
     return res.json({error : errors})
    }
    else {
      if (data.status == true) {
        res.json("this link is expired !")
      }
      else {
        Admin.updateOne({_id : req.params.id}, {$set : {status : true}}).then(() => res.json({notif : "account confirmed log in in your account now !"})).catch((err) => res.json(err))

      }
    }
  }).catch((err) => {
    res.json(err)
  })
}
exports.getAdmin = async (req, res) => {
  await Admin.find()
    .then((admins) => {
      res.status(200).json(admins);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

exports.blockAdmin = async (req, res) => {
  Admin.findOne({_id : req.body._id}).then((admin) => {
      if (admin == null) {
        return res.status(404).send({ message: "admin Not found." });
      }

        Admin.updateOne({_id : admin._id}, {$set : {ban : true}}).then(() => res.json({ notification: "Admin Blocked !" }))
        .catch((err) => res.json(err));
    })
    .catch((e) => console.log("error", e));
};

exports.UnblockAdmin = async (req, res) => {
  Admin.findOne({_id: req.body._id}).then((admin) => {
      if (admin == null) {
        return res.status(404).send({ message: "admin Not found." });
      }
      Admin.updateOne({_id : admin._id}, {$set : {ban : false}}).then(() => res.json({ notification: "Admin UnBlocked !" }))
      .catch((err) => res.json(err));
      
    })
    .catch((e) => console.log("error", e));
};

exports.updateAdmin = async (req, res) => {
  await Admin.updateOne(
    {
      _id: req.params.idAdmin,
    },
    {
      $set: {
        name: req.body.name,
        lastname: req.body.lastname,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
      },
    }
  )
    .then(() => {
      res.status(200).json("Admin updated");
    })
    .catch((err) => res.status(500).json(err));
};
