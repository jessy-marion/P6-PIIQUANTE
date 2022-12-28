const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth"); // a voir si vraiment utile de le mettre dans le route/user
const userCtrl = require("../controllers/user");

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

// router.get("/api/sauces", (req, res) => {
//   let token = req.headers["authorization"];
//   token = token.replace(/^Bearer\s+/, "");
//   console.log(token);
//   jwt.verify(token, TOKEN_SECRET_KEY, (err, decoded) => {
//     console.log(err);
//     console.log(decoded);
//   });
// });

module.exports = router;
