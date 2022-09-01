const express = require('express');
const mongoose = require('mongoose');
const Thing = require('./models/thing');

const userRoutes = require('./routes/user');
// const stuffRoutes = require('./routes/stuff');

mongoose.connect('mongodb+srv://Geoffray:Ts6ubUbdXjqLv5Y@cluster0.ubw3tpe.mongodb.net/?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json());
app.use('/api/auth', userRoutes);

// app.post('/api/sauces', (req, res, next) => {       //test pour bon fonctionnement
//   console.log(req.body);
//   res.status(201).json({
//     message: 'Objet créé !'
//   });
// });

app.post('/api/sauces', (req, res, next) => {
  delete req.body._id;
  const thing = new Thing({
    ...req.body   // opérateur spread qui va aller copier tous les champs dans le corps de la requète
  });
  thing.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
});

// app.get('/api/sauces/:id', (req, res, next) => {
//   Thing.findOne({ _id: req.params.id })
//     .then(thing => res.status(200).json(thing))
//     .catch(error => res.status(404).json({ error }));
// });

app.use('/api/sauces', (req, res, next) => {
  Thing.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
});

// app.use('/api/sauces', sauceRoutes);


module.exports = app;