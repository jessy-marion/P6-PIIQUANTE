const Sauce = require("../models/Sauce");

exports.sauce = (req, res, next) => {
  console.log("token bon ");
  res.send(["sauce1", "sauce2"]);
};

exports.postSauce = (req, res, next) => {
  console.log(req.body.sauce);
  const sauceObj = JSON.parse(req.body.sauce);
  console.log(
    `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
  );
  console.log(sauceObj);
  const sauce = new Sauce({
    userId: req.auth.userId,
    name: sauceObj.name,
    manufacturer: sauceObj.manufacturer,
    description: sauceObj.description,
    mainPepper: sauceObj.mainPepper,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`, // test image,
    heat: sauceObj.heat,
    likes: 0,
    dislikes: 0,
    userLiked: [], // test user
    userDisliked: [], // test user
  });
  console.log(sauce);
  sauce
    .save()
    .then(() => res.status(201).json({ message: "sauce crée" }))
    .catch(() =>
      res.status(400).json({ error: "erreur création de la sauce" })
    );
};
