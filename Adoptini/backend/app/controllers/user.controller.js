const User = require('../models/model.user');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require("../configs/jwt.config")
const nodemailer = require("../configs/nodemailer.config")

const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;


exports.registerUser = async (req, res) => {


  let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // @ts-ignore
      cb(null, __basedir + "/public/upload/image");
    },
    filename: (req, file, cb) => {
      file.originalname = Date.now() + '-' + file.originalname
      cb(null, file.originalname);
    },
  });

  let uploadFile = multer({
    storage: storage,
    limits: {
      fileSize: maxSize
    },
  }).single("file");


  let uploadFileMiddleware = util.promisify(uploadFile);

  try {

    await uploadFileMiddleware(req, res);
    if (req.file == undefined) {
      return res.status(400).send({
        message: "Please upload a file!"
      });
    }


    const { fullName, email, password, adresse, cin, rib } = req.body;
    let errors = [];
    let userPush = new User({
      fullname : fullName,
      email: email,
      password: bcrypt.hashSync(password, 10),
      photo: req.file.originalname,
      adresse: adresse,
      cin: cin,
      rib: rib
    })

    userPush.save().then((data) => {
      res.json({ notification: "please Check email confirmation !" })
      nodemailer.sendConfirmationEmail(userPush.fullname, userPush.email, data._id, 'user');
    }).catch((err) => {
      Object.values(err.errors).forEach((element) => {
        errors.push(element.message);
      });
      res.json({ errors: errors });
      console.log(err);
    })
          
  } 
        
  catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }

    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });

  }

}

exports.loginUser = (req, res) => {
  User.findOne({email: req.body.email}).then((user) => {
    if (user == null) {
      res.json({message: "email not found !" });
    }
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      res.json({
        message: "credential error !"
      });
    }
    if (user.status == false) {
      res.send({
        message: "Pending Account. Please Verify Your Email!",
      });
      return;
    } else {
      var token = jwt.sign({
        id: user._id,
        fullName: user.fullname,
        status: user.status,
        user: true,
      }, config.secret, {
        expiresIn: 86400
      })
      res.status(200).send({
        auth: true,
        token: token
      })

    }

  }).catch((err) => {
    if (err) return res.status(500).send('Error server.')
  });


}

exports.verifyUser = (req, res) => {
  let errors = [];
  User.findOne({
      _id : req.params.id
    })
    .then((user) => {
      if (user == null) {
        errors.push("error was found !");
        return res.json({ error: errors })
      }
      
      else {
        if (user.status == true) {
          res.json("this link is expired !")
        }
        else {
          User.updateOne({_id : req.params.id}, {$set : {status : true}}).then(() => res.json({notif : "account confirmed log in in your account now !"})).catch((err) => res.json(err))
  
        }
      }
      
    })
    .catch((e) => console.log("error", e));
}

exports.getUser = async (req, res) => {
  await User.find().then((users) => {
    res.status(200).json(users)
  }).catch((err) => {
    res.status(500).json(err)
  })
}

exports.deleteUser = async (req, res) => {
  await User.remove({
    _id: req.params.idUser
  }).then(() => {
    res.status(200).json("User Deleted");
  }).catch((err) => res.status(500).json(err));
}

exports.updateUser = async (req, res) => {

  await User.updateOne({
    _id: req.params.idUser
  }, {
    $set: {
      name: name,
      lastname: lastname,
      email: email,
      adresse: adresse,
      cin: cin,
      rib: rib,

    }
  }).then(() => {
    res.status(200).json("User updated");
  }).catch((err) => res.status(500).json(err))
}