const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");

const app = express();

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

app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);
app.use("/images/", express.static(path.join(__dirname, "images")));

module.exports = app;

app.listen(MY_PORT, console.log(`App listening on port ${MY_PORT}`));
