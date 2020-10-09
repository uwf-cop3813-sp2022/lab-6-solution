const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

let app = express();

// Set up the body parser
app.use( bodyParser.urlencoded( {extended: true}) );

// Set up cookie parser and sessions
const COOKIE_SECRET = 'keyboard cat';								// My secret to secure cookies
app.use( require('cookie-parser')(COOKIE_SECRET) ); // Parse incoming cookies

// Set up session for the user, based on cookies
app.use(session({
  secret: COOKIE_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// set up handlebars view engine
let handlebars = require('express-handlebars')
	.create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use( express.static(__dirname + '/public') );

app.get('/', function(req, res) {

	// If they are logged in (have a user object set)
	if(req.session.user) {

		// Render the home route and use user data
		res.render('home', {
			user: req.session.user
		});

	// Otherwise ask them to log in again
	} else {
		res.render('login', {
			error: "You need to log in!"
		});
	}

});

// Display the login prompt
app.get('/login', function(req, res) {
	res.render('login');
});

// Handle the login action
app.post('/login', function(req, res) {
	req.session.user = req.body.username;	// Set the username
	res.redirect('/');
});

// 404 catch-all handler (middleware)
app.use(function(req, res, next){
	res.status(404);
	res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function(){
  console.log( 'Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.' );
});
