const Sauce = require("../models/Sauce");

exports.postSauce = (req, res, next) => {
  const sauceObj = JSON.parse(req.body.sauce);

  const sauce = new Sauce({
    userId: req.auth.userId,
    name: sauceObj.name,
    manufacturer: sauceObj.manufacturer,
    description: sauceObj.description,
    mainPepper: sauceObj.mainPepper,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    heat: sauceObj.heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });

  sauce
    .save()
    .then(() => res.status(201).json({ message: "sauce crée" }))
    .catch(() =>
      res.status(400).json({ error: "erreur création de la sauce" })
    );
};

exports.modifySauce = (req, res, next) => {
  //si il y modification de l'image, trouver un moyen de supprimer l'ancienne

  const sauceObj = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete sauceObj._userId;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObj, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Objet modifié!" }))
          .catch(() => res.status(401).json({ message: "error" }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteSauce = (req, res, next) => {
  Sauce.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Sauce supprimée" }))
    .catch(() => res.status(400).json({ message: "erreur de suppression" }));
};

exports.sauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};
exports.sauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.like = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      let likeValue = req.body.like;
      let usersLiked = sauce.usersLiked;
      let usersDisliked = sauce.usersDisliked;

      switch (likeValue) {
        case 1:
          console.log("la valeur est " + likeValue);
          usersLiked.push(req.body.userId);
          usersDisliked = usersDisliked.filter((id) => id != req.body.userId);
          Sauce.updateOne(
            {
              _id: req.params.id,
            },
            {
              likes: sauce.likes + 1,
              dislikes: sauce.dislikes,
              usersLiked,
              usersDisliked,
              _id: req.params.id,
            }
          )
            .then(() => res.status(200).json({ message: "Objet modifié!" }))
            .catch(() => res.status(401).json({ message: "error" }));

          break;
        case -1:
          console.log("la valeur est " + likeValue);
          usersLiked = usersLiked.filter((id) => id != req.body.userId);
          usersDisliked.push(req.body.userId);
          Sauce.updateOne(
            {
              _id: req.params.id,
            },
            {
              likes: sauce.likes,
              dislikes: sauce.dislikes + 1,
              usersLiked,
              usersDisliked,
              _id: req.params.id,
            }
          )
            .then(() => res.status(200).json({ message: "Objet modifié!" }))
            .catch(() => res.status(401).json({ message: "error" }));

          break;

        default:
          usersLiked.some((element) => element === req.body.userId)
            ? (sauce.likes = sauce.likes - 1)
            : sauce.likes;
          usersDisliked.some((element) => element === req.body.userId)
            ? (sauce.dislikes = sauce.dislikes - 1)
            : sauce.dislikes;
          console.log("la valeur est " + likeValue);
          usersLiked = usersLiked.filter((id) => id != req.body.userId);
          usersDisliked = usersDisliked.filter((id) => id != req.body.userId);

          Sauce.updateOne(
            {
              _id: req.params.id,
            },
            {
              likes: sauce.likes,
              dislikes: sauce.dislikes,
              usersLiked,
              usersDisliked,
              _id: req.params.id,
            }
          )
            .then(() => res.status(200).json({ message: "Objet modifié!" }))
            .catch(() => res.status(401).json({ message: "error" }));

          break;
      }
    })
    .catch(() => res.status(401).json({ message: "error" }));
};
