const express = require('express');
const router = express.Router();
const identifiant = require ('../models/Node-form');

//...
//const { body, validationResult } = require('express-validator/check');
//constante check permettant de faire les verifications par rapport au champs  name et mail et ses conditions.
const { check, validationResult, matchedData } = require('express-validator');

// definition du module mangoose pour faire la connection par la suite a une BDD

const mongoose = require('mongoose');
//Definition d'une constante permettant la lecture de fichier json pour permettre la connection a une BDD de type Mongodb.
//Models are responsible for creating and reading documents from the underlying MongoDB database.
const NodeForm = mongoose.model('Node-form');// nom de la collection de la BDD

// definition d'une constante qui permettra l'utilisation du module http-auth qui permettra une authentification admin
const path = require('path');
const auth = require('http-auth');
const app = require('../app');
const { info } = require('console');
//definition d'une autre constante utilisant le module http-auth ou l'on spécifie un fichier qui sera analyser comportant le login et le mdp .
const basic = auth.basic({
  file: path.join(__dirname, '../users.htpasswd'),// fichier ou notre login et mdp scripter apparais
});


router.get('/', (req, res) => {
	//res.send('.: Il continue de dire NON avec la tête ! :.');
	//res.render('form');
	//apelle du fichier form.pug ou l'on retrouve no champs name et email 
	res.status(200).render('form', { 
		title: '.:GET:.',
		cancre: ' Bienvenu nouveau voyageur'
 	});
});

//methode post pour definir des conditions au differant champs (ex email doit etre un email valide donc contenir le @).
router.post('/', 
	[
	check('name')
		.isLength({ min: 1 })
		.withMessage('-Please, enter the name-')
    	.trim(),
	check('email')
		.isEmail()
		.withMessage('-Please enter an email-')
	    .bail()
	    .trim()
	    .normalizeEmail(),
	check('message')
		.isLength({ min : 1})
		.withMessage('-Please, send your message')
		.bail()
		.trim()	
	],
	// verifications des erreurs au moments de la validation de la saisie utilisateurs
		//declaration de la const errors
	(req, res) => {
		const errors = validationResult(req);
		
		//console.log(req.body);
		/*boucle pour parcourir les potentiels erreurs et adresser 
		un message a l'utilisateur avec le res.send*/
		if (errors.isEmpty()) {
			
			/*res.send('.:Thank you (￣▽￣)ノ:.');
			res.redirect('/');*/
			console.log(req.body);
			//nouvelle instance qui recupère les req utilisateur
			const nodeForm = new NodeForm(req.body);

			// utilisation de l'instance du dessus pour sauvegarder les requetes de l'utilisateurs dans la bdd si erreur on gere celle ci avec un catch sinon on affiche un message de reussite.

  			nodeForm.save()
			.then(() => { res.send('.:Nous avons bien pris en compte votre demande :.'); })
			.catch((err) => {
					console.log(err);
  					res.send('.: Sorry! Something went wrong :.');
				}
			);
		} else {
			res.render('contacts', {
				title: '-:POST:-', 
				errors: errors.array(),
				data: req.body,
			});
		}
		//Definition du module nodemailer, ne pas oubliez de l'installer avec Npm install nodemailer
		const nodemailer = require('nodemailer');

	//STEP 1 creation du transporter
	// creation d'une variable transporter, on l'apelle ainsi car c'est elle qui nous permet de nous connecter et de recevoir les infos sur notre mail,
		let transporter = nodemailer.createTransport({
			host: "smtp.mailtrap.io",// l'host est le logiciel de gestion de mail que l'on utilise ici mailtrap
			port: 2525,
			auth: {
			user: "600a4963e6bf58", // ici se sont nos identifiant retrouver dans mailtrap
			pass: "aa479229a5801c" // ici le mdp en cripter bien evidement
			}
		});

		//Step2 creation de la fonction permertant de recuperer les champs dont on a besoins.
		let mailOptions = ({ //Creation d'une fonction qui nous permet de recuper les champs nécessaires ici 
			from: 'laurent-36100@hotmail.fr',// ici on recuperère le sender donc l'envoyeur
			to: req.body.email,//ici on recupère l'email de l'utilisateur
			subject : "hello",// ici on affiche seulement un objets comme dans tout mail classique
			text: req.body.message// ici on recupère le message de l'utilisateur
			
			
		});

		//Step 3  gestions des érreurs.

		transporter.sendMail(mailOptions,function(err){
			if (err) {
				console.log('erreur ici')
			} else {
				console.log('Email envoyer')
			}
		});
});

// initialisation de la route list via la methode Get ou l'on verra les données utilisateurs enrengistrer (en l'occurence le nom et le mail.)
//res render renvoie a l'index.pug qui est un enfant de layout.

//utilisation d'un check de l'authentification des infos envoyer par l'utilisateur et verifie que le login et le mot de passe concorde.
router.get('/list', basic.check((req, res) => {
  NodeForm.find()
    .then((nodeForms) => {
      res.render('index', { title: '-:List of records:-', nodeForms });
    })
    .catch(() => { res.send('-:Sorry! Something went wrong ( ͡ ͜ʖ ͡ ) :-'); });
}));


  router.get('/contacts', basic.check((req, res) => {
	res.render('contacts');
}))

module.exports = router; //permet d'exporter ce module pour l'appeller ensuite sur les autres fichiers.
