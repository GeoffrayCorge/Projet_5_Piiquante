// runtime node, permets d'exécuter du code javascript côté serveur

const http = require('http');       //importer le package http de node afin de créer un serveur
const app = require('./app');       //importer le app.js

const normalizePort = val => {      //normalizePort renvoi un port valide sous forme d'un numéro ou d'une chaîne    
  const port = parseInt(val, 10);   

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000');   // par défaut,en développement, on utilise le port 3000, mais si celui ci n'est pas disponible, on utilise la variable environnement (si l'envirronnement sur lequel tourne le serveur envoi un port à utiliser, utiliser ce port là, sinon 3000) === server.listen(process.env.PORT || 3000);
app.set('port', port);      //on dit à l'application express sur quel port elle doit tourner

const errorHandler = error => {       //la fonction errorHandler recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);        //méthode createServe du package hhtp : création du serveur qui prends comme argument la fonction qui sera appelé à chaque requète reçu du serveur (ici : app) app === req, res (c'est une fonction donc elle reçoit une requète et envoie une réponse)

server.on('error', errorHandler);       //écouteur d'évènements consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
