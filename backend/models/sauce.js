const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    sauce: { type: String, required: true },
    image: { type: String, required: true },
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepperIngredient: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    // userLiked: { type: String, required: true },
    // userDisliked: { type: String, required: true }
});


module.exports = mongoose.model('Sauce', sauceSchema);