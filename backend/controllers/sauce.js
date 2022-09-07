// pour rendre la structure encore plus modulaire, et simplifier la lecture et la gestion du code, on sépare la logique métier des routes en contrôleurs


const Sauce = require('../models/sauce');
const fs = require('fs');       // (file system) donne accès aux fonctions qui permets de modifier le système de fichiers y compris aux fonctions permettant de supprimer les fichiers 

exports.getAllSauce = (req, res, next) => {             //on lit toutes les sauces dans la base de donnée
    Sauce.find()            //méthode find pour avoir la liste complète qui retourne une promise
        .then((sauces) => res.status(200).json(sauces))     //on récupère le tableau de toutes les sauces et les renvoi en réponse (code 200 : succès de la requête)
        .catch((error) => res.status(404).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })           //methode fineOne pour récupérer un seul objet suivant son identifiant // on passe un objet de comparaison => _id est le même que req.params.id
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({ error }));  // code 404 : ressource non trouvée 
};

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);        //on va parser l'objet requète car l'objet envoyé dans la requête est en JSON mais en châine de caractère (à cause de multer)
    delete sauceObject._id;             // suppression de l'id créer par MongoDb
    delete sauceObject._userId          // suppresion de userId qui correspond à la personne qui a créé l'objet parce que nous ne voulons pas faire confiance au client
    const sauce = new Sauce({
        ...sauceObject,  //opérateur spread qui va aller copier tous les champs dans le corps de la requète moins les deux champs supprimé
        userId: req.auth.userId,        //on utilise le userid qui vient du token d'authentification et non de l'ID de l'utilisateur (on est sûr que l'ID du token est valide) // cela permet d'empêcher quelqu'un de mal intentionné de faire une requête avec son token d'autification en nous envoyant l'ID de quelqu'un d'autre  
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,       //multer ne nous donne que le nom de fichier, on génère donc l'url par nous même  //req.protocol permet d'obtenir le premeir segment (ici http), req.get('host') résouds l'hôte du serveur (ici localhost:3000)
        likes: 0,         //initialise les likes à 0
        dislikes: 0,        //initialise les dislikes à 0
        usersLiked: [' '],      //initialise les usersliked avec un tableau vide
        usersDisliked: [' '],       //initialise les usersDisliked avec un tableau vide
    });
    sauce.save()
        .then(() => res.status(200).json({ message: "Sauce enregistrée" }))
        .catch((error) => res.status(404).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    // si il n'y a aucun de fichier de transmis, l'objet n'est pas sous forme de caractère. C'est l'inverse si un fichier est transmis
    const sauceObject = req.file ? {        // interrogation si il y a un champs file
        ...JSON.parse(req.body.sauce),      // si oui, on le convertit en JSON car il est en chaîne de caractère
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`        // puis on créé l'URL de l'image
    } : { ...req.body };  // sinon on recupère l'objet dans le corps de la requête

    delete sauceObject._userId;     // évite que quelqu'un crée un objet à son nom puis le modifie pour le réassigner à quelqu'un d'autre
    Sauce.findOne({ _id: req.params.id })       // on va chercher l'objet dans la base de donnée afin de vérifier si c'est bien l'utilisateur à qui appartient ce fichier qui cherche à le modifier
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {      // si userId récupéré en base différent du user id du token
                res.status(401).json({ message: 'Utilisateur non authorisé' });
            } else {
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })     //updateOne pour mettre à jour // deux éléments de comparaison => _id le même que l'id du paramètre de requête ET nouvel object (sauceObject) avec le spread operator pour récupérer la sauce qui est dans le corps de la requète et _id correspond à l'id des paramètres
                    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
                    .catch((error) => res.status(401).json({ error }));
            }
        })
        .catch((error) => res.status(404).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })       // on récupère la sauce
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {      // si user id récupéré en base different du user id du token
                res.status(401).json({ message: 'Utilisateur non authorisé' });
            } else {        // sinon on supprime la sauce de la base de donnée ainsi que l'image
                const filename = sauce.imageUrl.split('/images/')[1];       // on récupère le nom de fichier dans le répertoire image grâce au split // [1] car le nom de fichier est juste après 
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })     // il prend l'object de comparaison _id = id du paramètre de la requête
                        .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                        .catch((error) => res.status(401).json({ error }));
                });
            }
        })
        .catch((error) => res.status(404).json({ error }));
};

