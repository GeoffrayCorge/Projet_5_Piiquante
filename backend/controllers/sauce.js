const Sauce = require('../models/sauce');
const fs = require('fs');

exports.getAllSauce = (req, res, next) => {             //on lit toutes les sauces dans la base de donnée
    Sauce.find()            //méthode find pour avoir la liste complète qui retourne une promise
        .then((sauces) => res.status(200).json(sauces))     //on récupère le tableau de toutes les sauces et les renvoi en réponse (code 200 : succès de la requête)
        .catch((error) => res.status(404).json({ error }));
};

exports.getOneSauce = (req, res, next) => {             
    Sauce.findOne({ _id: req.params.id })           //methode fineOne pour récupérer un seul objet suivant son identifiant // on passe un objet de comparaison => _id est le même que req.params.id
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));  // code 404 : ressource non trouvée 
};

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);        //on va parser l'objet requète car l'objet envoyé dans la requête est en JSON mais en châine de caractère
    delete sauceObject._id;             // suppression de l'id créer par MongoDb
    delete sauceObject._userId
    const sauce = new Sauce({
        ...sauceObject,  //opérateur spread qui va aller copier tous les champs dans le corps de la requète
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,       //multer ne nous donne que le nom de fichier, on génère donc l'url par nous même
        likes: 0,         //initialise les likes à 0
        dislikes: 0,        //initialise les dislikes à 0
        usersLiked: [' '],      //initialise les usersliked avec un tableau vide
        usersDisliked: [' '],       //initialise les usersDisliked avec un tableau vide
    });
    sauce
        .save()
        .then(() => res.status(201).json({ message: "Sauce enregistrée" }))
        .catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete sauceObject._userId;
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })     //updateOne pour mettre à jour // deux éléments de comparaison => _id le même que l'id du paramètre de requête ET nouvel object (sauceObject) avec le spread operator pour récupérer la sauce qui est dans le corps de la requète et _id correspond à l'id des paramètres
                    .then(() => res.status(200).json({ message: 'Objet modifié!' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })     // il prend l'object de comparaison _id = id du paramètre de la requête
                        .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

