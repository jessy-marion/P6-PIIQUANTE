const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { remove } = require("./models/User");

const app = express();

const MY_PORT = process.env.PORT;
const MONGO_DB_NAME = process.env.NAME;
const MONGO_DB_PASSWORD = process.env.PW;
const TOKEN_SECRET_KEY = process.env.TSK;

const User = require("./models/User");

/* Set up Mongoose*/
mongoose.set("strictQuery", false);
mongoose
  .connect(
    `mongodb+srv://${MONGO_DB_NAME}:${MONGO_DB_PASSWORD}@oc-p6.phsikdj.mongodb.net/?retryWrites=true&w=majority`,
    { useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => console.log(error));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use((req, res, next) => {
  console.log("serveur ok");
  next();
});

app.get("/", (req, res, next) => {
  res.send("Hello world");
  next();
});

app.post("/api/auth/signup", (req, res, next) => {
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
});

app.post("/api/auth/login", (req, res, next) => {
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
});

app.get("/api/sauces", (req, res) => {
  let token = req.headers["authorization"];
  token = token.replace(/^Bearer\s+/, "");
  console.log(token);
  jwt.verify(token, TOKEN_SECRET_KEY, (err, decoded) => {
    console.log(err);
    console.log(decoded);
  });
});

module.exports = app;

app.listen(MY_PORT, console.log(`App listening on port ${MY_PORT}`));
