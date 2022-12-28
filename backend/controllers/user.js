const dotenv = require("dotenv");
dotenv.config();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const TOKEN_SECRET_KEY = process.env.TSK;

exports.signup = (req, res, next) => {
  //ajouter bcrypt et hash le mdp
  console.log(req.body);

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      // delete user._id; //id impossible a enlever
      console.log(user);
      user
        .save()
        .then(() => res.status(201).json({ message: "utilisateur crée" }))
        .catch(() => res.status(400).json({ error }));
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

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
