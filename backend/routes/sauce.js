const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');

router.get('/', auth, sauceCtrl.getAllSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);     //l'ordre des middleware est important. Si nous plaçons multer avant le middleware d'authentification, même les images des requêtes non authentifiées seront enregistrées dans le serveur
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);    //put => modification
router.delete('/:id', auth, sauceCtrl.deleteSauce);


module.exports = router;