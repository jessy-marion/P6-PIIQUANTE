const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const sauceCtrl = require("../controllers/sauce");
const app = express();

router.get("/", auth, sauceCtrl.sauce);

router.post("/", auth, multer, sauceCtrl.postSauce);

module.exports = router;
