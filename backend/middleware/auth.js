const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const TOKEN_SECRET_KEY = process.env.TSK;

// module.exports = (req, res, next) => {
//   let token = req.headers["authorization"];
//   token = token.replace(/^Bearer\s+/, "");
//   console.log(token);
//   jwt.verify(token, TOKEN_SECRET_KEY, (err, decoded) => {
//     console.log(err);
//     console.log(decoded);
//   });
// };

module.exports = (req, res, next) => {
  let token = req.headers["authorization"];
  token = token.replace(/^Bearer\s+/, ""); // ?? const header = req.header("Authorization")//header.splitt(" ") ??
  if (token == undefined) {
    return res.status(403).json({ error: "unauthorized request" });
  }
  console.log(token);
  jwt.verify(token, TOKEN_SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(403).json({ error: "unauthorized request" });
    } else if (decoded) {
      const userId = decoded.userId;
      req.auth = {
        userId: userId,
      };
      console.log(req.auth);
      next();
    }
  });
};
