const dotenv = require("dotenv");
dotenv.config();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const TOKEN_SECRET_KEY = process.env.TSK;

/*Enregistrement d'un user, Hash mdp*/
exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });

      user
        .save()
        .then(() => res.status(201).json({ message: "utilisateur crée" }))
        .catch((error) => {
          res.status(400).json({ message: error._message });
        });
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
};

/*Connexion de l'user, creation token*/
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (valid) {
              res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                  {
                    userId: user._id,
                  },
                  TOKEN_SECRET_KEY,
                  { expiresIn: "24h" }
                ),
              });
            } else {
              return res.status(401).json({ error: "Mdp incorrect" });
            }
          })
          .catch((error) => {
            res.status(500).json({ error: "Probleme serveur" });
          });
      } else {
        return res.status(401).json({ message: "utilisateur non enregistré" });
      }
    })
    .catch((error) => console.log(error));
};
