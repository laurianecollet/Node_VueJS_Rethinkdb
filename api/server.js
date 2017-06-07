/**
 * Initiation de Express
 */

let express = require('express')
let app = express()


/**
 * Modules de Securité d'une API (logs, XSS securité etc...)
 */
let cors = require('cors');
let bodyParser = require('body-parser'); // securisé les données en POST
let logger = require('morgan'); // Produit des logs
let helmet = require('helmet'); // Création et expiration de session 
let passport = require('passport'); // authentification
app.use(logger('dev'));
app.use(require('cookie-parser')());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('express-session')({ secret: 'hK34B23B4HJ', resave: false, saveUninitialized: false }));
app.use(bodyParser.json());
app.use(cors());
logger('tiny')
app.use(helmet());


/**
 * Module RethinkDb
 */
let r = require('rethinkdb');



// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());




/**
 * Erreur 500 sortie en JSON
 */
app.use(function (error, request, response, next) { // use est un middleware sur express , c'est une couche entre app.get et la reponse que tu vas envoyer
	response.status(error.status || 500);
	response.json({ error: error.message });
});



// La connexion à la base de données
let connection = r.connect({
	db: "test" //your database
}).then((connection) => { // une fois qu'il a effectuer une connexion


	app.get('/', (req, res) => {
		r.table('users').pluck('name', 'email', 'id').orderBy('name').run(connection, (err, cursor) => { // lancer la requete avec la fonction run()
			if (err) throw err;
			cursor.toArray((err, result) => {
				res.json(result);
			})
		})
	});

	app.get('/invisible', (req, res) => {
		r.table('users').filter({ enable: false }).pluck('name', 'email', 'id').run(connection, (err, cursor) => { // lancer la requete avec la fonction run()
			if (err) throw err;
			cursor.toArray((err, result) => {
				res.json(result);
			})
		})
	});

	app.get('/remove/:id', (req, res) => {
		// :id c'est pour envoyer un parametre à l'url
		let id = req.params.id; // récupérer l'id en get en url
		r.table('users').get(id).delete().run(connection, (err, cursor) => { // lancer la requete avec la fonction run()
			if (err) throw err;
			r.table('users').pluck('name', 'email', 'id').orderBy('name').run(connection, (err, cursor) => {
				cursor.toArray((err, result) => {
					res.json(result);
				})
			})
		})
	});

	app.get('/detail/:id', (req, res) => {
		// :id c'est pour envoyer un parametre à l'url
		let id = req.params.id; // récupérer l'id en get en url
		r.table('users').get(id).run(connection, (err, result) => { // lancer la requete avec la fonction run()
			res.json(result);
		})
	});

	app.post('/newUser', (req, res) => {
		//req.body pour récupérer un parametre en post 
		//req.params => parametre en GET (URL)
		let user = req.body; // je recupere les données en post

		r.table('users').insert(user).run(connection, (err, cursor) => { // lance la requete qui va inserer puis après ca lance moi la requete avec pluck , mais tout peut-être mis sur la meme ligne
			if (err) throw err;
			r.table('users').pluck('name', 'email', 'id').orderBy('name').run(connection, (err, cursor) => {
				cursor.toArray((err, result) => {
					res.json(result);
				})
			})
		})
	});


});

app.listen(3000, function () {
	console.log('Listened on port 3000!')
})