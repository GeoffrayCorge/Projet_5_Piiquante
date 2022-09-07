// ne pas stocker les mots de passes sous forme de texte brut car quiconque accèderait à la base de données verrait la liste complètes des informations de connexion

const User = require('../models/user');
// bcrypt comparera le mot de passe entré au mot de passe hashé stocké dans la base de données // Le package bcrypt permet d'indiquer si les deux hashs ont été générés à l'aide d'un même mot de passe initial et aidera  à implémenter correctement le stockage et la vérification sécurisés des mots de passe
const bcrypt = require('bcrypt');       // package de chiffrement qui utilise un algorithme unidirectionnel pour chiffrer et créer  un hash des mots de passe utilisateur
const jwt = require('jsonwebtoken');     // jsonwebtoken  // permet  d'encoder un token afin de vérifier qu'un utilisateur s'est bien authentifié

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)   //fonction asynchrone => le 10 correspond au "salt", c'est le nombre de fois que le mot de passe sera crypté, plus il y en a, plus c'est sécurisé mais plus ça prendra du temps
        .then(hash => {       //on récupère le hash de mot de passe
            const user = new User({     //création du nouveau user avec le modèle mongoose
                email: req.body.email,
                password: hash
            });
            user.save()     //enregistrement du nouveau user
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));     // 500 : erreur serveur
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })         //méthode findOne de la classe User 
        .then(user => {
            if (!user) {        // si le user n'existe pas
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)  //sinon on compare le mot de passe entré au mot de passe dans la base de données
                .then(valid => {
                    if (!valid) {       // si mot de passe différent
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({      //sinon création d'un objet qui contient les informations nécessaires à l'authentification des requêtes qui seront émisent par le client
                        userId: user._id,
                        token: jwt.sign(        // appel de la fonction sign de jwt qui prends quelques arguments
                            // payload : données que l'on veut encoder à l'intérieur du token 
                            { userId: user._id },       // on encode le user id afin de ne pas pouvoir modifier un objet créé par un autre utilisateur 
                            'RANDOM_TOKEN_SECRET',    //clé secrète pour l'encodage  // en production, on utiliserai une chaîne de caractère beaucoup plus longue et alétoire pour sécuriser l'encodage
                            { expiresIn: '24h' }    // argument de configuration
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};