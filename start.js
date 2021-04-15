require('colors');
require('dotenv').config();
require('./models/Node-form');

const app = require('./app');

// rapelle du module mongoose pour au lancement du serveur établir la connexion a la base de données pou par la suite recueillir les infos qui seront saisis
const mongoose = require('mongoose');

//initialisation des parametre a la connextion a la BDD
mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    // connection a la Bdd avec une gerance d'érreur.
    mongoose.connection
      .on('open', () => {
        console.log('-: Mongoose connection open :-');
      })
      .on('error', (err) => {
        console.log(`-: Connection error: ${err.message} :-`);
      });

const server = app.listen(3070, () => {
      console.log(`.: --------------------------------:.`.bgGray.red);
      console.log(`.: Express is running on port ${server.address().port} :.`.bgGray.blue);
      console.log(`.: --------------------------------:.`.bgGray.red);
});
