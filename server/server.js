//====== APP SETUP ======

global.app = {
	express: {},
	router: {},
	modules: {},
	utilities: {},
	models: {},
	dev: {
		port: 1337
	}
}

app.utilities.ensureAuthenticated = function ensureAuthenticated(req,res,next) {
	if (!req.user) {
		res.json({
			ok: false,
			message: 'User is not logged in!',
			data: null
		});
		return;
	}

	next();
}

app.utilities.ensureAuthenticatedFancy = function ensureAuthenticatedFancy(req,res,next) {
	if (!req.user) {
		res.redirect('/?e=l');
		return;
	}

	next();
}

app.modules.http = require('http');
app.modules.express = require('express');
app.modules.session = require('express-session');
app.modules.mongoose = require('mongoose');
app.modules.cookieParser = require('cookie-parser');
app.modules.bodyParser = require('body-parser');
app.modules.methodOverride = require('method-override');
app.modules.passport = require('passport');
app.modules.util = require('util');
app.modules.ejs = require('ejs');
app.modules.googleStrategy = require('passport-google-oauth');
app.modules.moment = require('moment');
app.utilities.api_manager = require('./routes/api_manager');
app.utilities.auth = require('./routes/auth/auth');
app.utilities.router = require('./routes/router');

//====== MONGODB SETUP ======

if (app.dev) {
	mongo_url = "mongodb://localhost:27017/kaykay-dev";
}

app.modules.mongoose.connect(mongo_url);

app.models.Kaycard = require('./models/Kaycard');
app.models.Project = require('./models/Project');
app.models.User = require('./models/User');

//====== EXPRESS SETUP ======
app.express = app.modules.express();
app.modules.server = app.modules.http.createServer(app.express);
app.express.use(app.modules.session({secret:'dont even need a scale'}));
app.express.use(app.modules.cookieParser());
app.express.use(app.modules.bodyParser.urlencoded({'extended':'true'}));
app.express.use(app.modules.bodyParser.json());
app.express.use(app.modules.methodOverride());
app.express.use(app.modules.passport.initialize());
app.express.use(app.modules.passport.session());
app.express.use('/js', app.modules.express.static(__dirname + '/../public/js/'));
app.express.use('/css', app.modules.express.static(__dirname + '/../public/css/'));
app.express.use('/img', app.modules.express.static(__dirname + '/../public/images/'));
app.express.use('/api',app.utilities.api_manager);
app.express.use('/auth',app.utilities.auth);
app.express.use('/',app.utilities.router);
app.express.set('view engine','html');
app.express.engine('html', require('ejs').renderFile);
app.express.set('views',__dirname + '/views');

app.modules.passport.serializeUser(function(user,done){
	done(null,user.id);
});

app.modules.passport.deserializeUser(function(id,done){
	app.models.User.findOne({id:id}, function(err, user){
		done(err,user);
	});
});

app.modules.server.listen(app.dev.port);
console.log("App listening on: "+app.dev.port);
