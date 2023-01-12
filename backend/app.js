const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");

const app = express();

/*.env*/
const MY_PORT = process.env.PORT;
const MONGO_DB_NAME = process.env.NAME;
const MONGO_DB_PASSWORD = process.env.PW;

const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

/* Set up Mongoose*/
mongoose.set("strictQuery", false);
mongoose
  .connect(
    `mongodb+srv://${MONGO_DB_NAME}:${MONGO_DB_PASSWORD}@oc-p6.phsikdj.mongodb.net/?retryWrites=true&w=majority`,
    { useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => console.log(error));

/* 🙂 si lors du npm start l'erreur querySrv ECONNREFUSED _mongodb.tcp.oc-p6.phsikdj.mongodb.net at QueryReqWrap.onresolve apparait, commentez le bloc mongoose.connect ci-dessus et décommentez le bloc ci-dessous 🙂*/

// mongoose
//   .connect(
//     `mongodb://${MONGO_DB_NAME}:${MONGO_DB_PASSWORD}@ac-pqi2lee-shard-00-00.phsikdj.mongodb.net:27017,ac-pqi2lee-shard-00-01.phsikdj.mongodb.net:27017,ac-pqi2lee-shard-00-02.phsikdj.mongodb.net:27017/?ssl=true&replicaSet=atlas-gzmtuq-shard-0&authSource=admin&retryWrites=true&w=majority`,
//     { useUnifiedTopology: true }
//   )
//   .then(() => console.log("Connexion à MongoDB réussie !"))
//   .catch((error) => console.log(error));

app.use(express.json());

/*CORS */
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

//middleware
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);
app.use("/images/", express.static(path.join(__dirname, "images")));

module.exports = app;

app.listen(MY_PORT, console.log(`App listening on port ${MY_PORT}`));
