const User = require('../models/model.user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
let config = require("../config/jwt.config");

exports.signup =  (req, res, next) => {
         bcrypt.hash(req.body.password, 10)
            .then(hash => {
            const newUser = new User({
                email: req.body.email,
                password: hash
            });
             newUser.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    var error = [];
    User.findOne({ email: req.body.email }).select('password')
      .then(user => {
          if (user == null) {
            error.push("email not found !")
            res.json({ error: error });
            return;
          }
          var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
          if (!passwordIsValid){
              error.push("password not valid !")
              return res.json({
                  error: error
              });
          }
          else{
              var token = jwt.sign({
                userId: user._id,
                user: true,
              }, config.secret, {
                  expiresIn: 86400
             })
              res.status(200).send({
                  auth: true,
                  token: token
                })
            }
          })
      .catch(error => res.status(500).json({ error }));
};