// le middleware va vérifier les informations d'authentification envoyées par le client
// il va prendre le token envoyé par le client, vérifiera la validité et permettra aux différentes routes d'en exploiter les différentes informations tel que le user id

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {        // pendant cette étape, il peut se passer un certain nombre d'erreur donc utilise le try ... catch
        // quand on récupère le token, il est composé de deux parties : 'bearer' et le token   
        const token = req.headers.authorization.split(' ')[1];    // on extrait le token du header Authorization de la requête entrante // utilisation de la fonction split pour tout récupérer après l'espace dans le header // on veut la deuxième partie donc [1]   
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');       // on décode le token avec la méthode verify de jwt // on passe le token récupéré et la clé secrête
        const userId = decodedToken.userId;      // on extrait l'ID du token 
        req.auth = {     // on l'ajoute à l'objet request qui est transmis aux routes appelées par la suite
            userId: userId
        };
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};