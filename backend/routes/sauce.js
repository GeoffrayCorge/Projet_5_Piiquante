// Permets de dissocier la logique de routing à la logique globale de l'application

const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sauceCtrl = require('../controllers/sauce');

const router = express.Router();  // création du routeur Express

// importation de chaque controlleur 
// application des middlewares appropriés pour les routes 
// en ajoutant multer, le format de la requête va avoir changé donc il faut modifier la gestion de la route

router.get('/', auth, sauceCtrl.getAllSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);     //l'ordre des middleware est important. Si nous plaçons multer avant le middleware d'authentification, même les images des requêtes non authentifiées seront enregistrées dans le serveur
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);    //put => modification
router.delete('/:id', auth, sauceCtrl.deleteSauce);


module.exports = router; 