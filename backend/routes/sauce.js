const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const sauceCtrl = require("../controllers/sauce");
const app = express();

router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.get("/:id", auth, sauceCtrl.sauce);
router.get("/", auth, sauceCtrl.sauces);
router.post("/", auth, multer, sauceCtrl.postSauce);

router.post("/:id/like", sauceCtrl.like);

module.exports = router;
