// implémentation des téléchargements de fichiers pour que les utilisateurs puissent télécharger des images de sauce

const multer = require('multer');   // package qui  permet de gérer les fichiers entrants dans les requêtes HTTP 

// création d'un dossier images dans lequel les images seront enregistrées

const MIME_TYPES = {    // constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({    // création d'un objet de configuration  // diskStorage => enregistrer sur le disque
  destination: (req, file, callback) => {   // destination est une fonction qui va expliquer à multer dans quel dossier il va enregistrer les fichiers
    callback(null, 'images');   // on appelle la fonction callback avec un argument 'null' pour dire qu'il n'y a pas eu d'erreur à ce niveau là et en passant le nom du dossier en deuxième argument
  },
  filename: (req, file, callback) => {    // filename va expliquer à multer quel nom de fichier utiliser (on ne va pas utiliser le nom de fichier d'origine car cela peut poser des problèmes si deux fichiers ont le même nom)
    const name = file.originalname.split(' ').join('_');     //split permet de supprimer les espaces et les remplacer par des underscore : cela crée un tableau avec les différents mots du nom de fichier puis va rejoindre ce tableau en un seul string sans les espaces mais avec les underscore
    const extension = MIME_TYPES[file.mimetype];    // élément du dictionnaire qui correspond au mime type du fichier envoyé par le frontend
    callback(null, name + Date.now() + '.' + extension);  // création du file name entier : name + Date.now (time stamp) (à la milliseconde près) + '.' + extension
  }
});

module.exports = multer({ storage }).single('image');   //single pour dire que c'est un fichier unique et non pas un groupe de fichier