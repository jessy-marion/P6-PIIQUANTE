const mongoose = require("mongoose");

//schema de donnée
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: true },
  dislikes: { type: Number, required: true },
  userLiked: { type: ["String <userid>"], required: true },
  userDisliked: { type: ["String <userid>"] },
});

module.exports = mongoose.model("Sauce", sauceSchema);
