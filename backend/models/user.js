const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');  // package de validation pour prévalider les informations avant de les enregistrer

const userSchema = mongoose.Schema({  // création du modèle utilisateur
  email: { type: String, required: true, unique: true },   //unique permet de ne pas se connecter deux fois avec la même adresse mail
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);  // assurera que deux utilisateurs ne puissent partager la même adresse e-mail



module.exports = mongoose.model('User', userSchema);