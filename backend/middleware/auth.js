const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const TOKEN_SECRET_KEY = process.env.TSK;

module.exports = (req, res, next) => {
  let token = req.headers["authorization"];
  token = token.replace(/^Bearer\s+/, "");
  if (token == undefined) {
    return res.status(403).json({ error: "unauthorized request" });
  }

  jwt.verify(token, TOKEN_SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(403).json({ error: "unauthorized request" });
    } else if (decoded) {
      const userId = decoded.userId;
      req.auth = {
        userId: userId,
      };

      next();
    }
  });
};
