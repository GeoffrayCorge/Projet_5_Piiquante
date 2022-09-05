const express = require('express');       //Coder des serveurs web en Node pur est possible, mais long et laborieux. En effet, cela exige d'analyser manuellement chaque demande entrante. L'utilisation du framework Express simplifie ces tâches, en nous permettant de déployer nos API beaucoup plus rapidement. 
const mongoose = require('mongoose');   //MongoDB est une base de données NoSQL. Cela signifie que l'on ne peut pas utiliser SQL pour communiquer avec. Les données sont stockées comme des collections de documents individuels décrits en JSON 
const path = require('path');

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

mongoose.connect('mongodb+srv://Geoffray:Ts6ubUbdXjqLv5Y@cluster0.ubw3tpe.mongodb.net/?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();        //on appelle la méthode express afin de créer une application Express


app.use((req, res, next) => {  //middleware général, pas de route spécifique, appliquer à toutes les routes et requêtes       //erreur de CORS (Cross Origin Resource Sharing) (Il s'agit d'un système de sécurité qui, par défaut, bloque les appels HTTP entre des serveurs différents, ce qui empêche donc les requêtes malveillantes d'accéder à des ressources sensibles)
  //on ajoute des headers à notre objet réponse qui renvoi au navigateur pour dire qu'on peut utiliser cet API
  res.setHeader('Access-Control-Allow-Origin', '*');    // * : tout le monde ; ici on dit que l'origine qui a le droit d'accéder à l'API c'est tout le monde
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');    // on donne l'autorisation d'utiliser certains en-têtes
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');    // on donne l'autorisation d'utiliser certaines méthodes
  next();       //renvoi vers le prochain middleware
});

app.use(express.json());        //

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;         //on exporte l'application  afin de l'utiliser dans les autres fichiers


// Une application Express est fondamentalement une série de fonctions appelées middleware. Chaque élément de middleware reçoit les objets request et response , peut les lire, les analyser et les manipuler, le cas échéant. Le middleware Express reçoit également la méthode next , qui permet à chaque middleware de passer l'exécution au middleware suivant.