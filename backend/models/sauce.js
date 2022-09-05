const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({           //on crée un modèle de données // on va passer un objet qui va dicter les diffrérents champs que notre schéma va avoir besoin
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    usersLiked: { type: [String], required: true },
    usersDisliked: { type: [String], required: true }
});

module.exports = mongoose.model('Sauce', sauceSchema);