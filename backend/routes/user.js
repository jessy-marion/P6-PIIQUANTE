const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth"); // a voir si vraiment utile de le mettre dans le route/user
const userCtrl = require("../controllers/user");

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
