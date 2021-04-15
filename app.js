const express = require('express');
const router = require('./routes/index');
//ajout de la constante path par rapport au 2eme fichier
const path = require('path');
const app = express();

//ajout des views avec le modele indiquer ici pug 

// ajout du middlewhare bodyparser
const bodyParser = require('body-parser');

// on explique que tous les fichiers static seront à chercher dans public
app.use(express.static('public'))

//..
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// body parset permet d'initaliser les body.req etc...
/*
using 'body-parser' 'urlencoded' method allows us to 
handle data sent as application/x-www-form-urlencoded
There are various ways to format the data you POST to the server
*/
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);

module.exports = app;
