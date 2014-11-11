var googleAuth = app.modules.express.Router();

var GoogleStrategy = app.modules.googleStrategy.OAuth2Strategy;
var GOOGLE_CLIENT_ID = "772314978602-8ke6tfj8ep1na5h679tr49d5jquv881n.apps.googleusercontent.com";
var GOOGLE_CLIENT_SECRET = "RaALOLwLgLD4vhKjuwG1-eqP";
var callbackURL = "http://localhost:1337/auth/google/callback";

var passport = app.modules.passport;

passport.use(new GoogleStrategy({
		clientID: GOOGLE_CLIENT_ID,
		clientSecret: GOOGLE_CLIENT_SECRET,
		callbackURL: callbackURL
	},
	function(accessToken,refreshToken,profile,done) {
		app.models.User.findOne({'id':profile.id}, function(err,user){
			if(err){
				return done(err);
			}

			if(user){
				return done(null,user);
			}else{
				var newUser = new app.models.User({
					firstName: profile.name.givenName,
					id: profile.id,
					displayName: profile.displayName,
					email: profile.emails[0].value,
					picture: profile._json.picture
				});

				newUser.save(function(err){
					if(err){
						throw err;
					}
					return done(null,newUser);
				});
			}
		});
	}
));

googleAuth.route('/')
	.get(passport.authenticate('google', {scope:['https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email']}),
		function(req,res){

		});

googleAuth.route('/callback')
	.get(passport.authenticate('google',{failureRedirect:'/'}),
		function(req,res){
			res.redirect('/');
		});


module.exports = googleAuth
