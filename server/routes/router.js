var router = app.modules.express.Router();

	router.route('/').get(function(req,res){
		if(req.user){
			res.render('projects',{user:req.user});
		} else{
			res.send('<h1>Welcome to KK</h1>');
		}
	});

	router.route('/project/:id').get(app.utilities.ensureAuthenticated,function(req,res){
		res.render('project',{id:req.params.id});
	});

	router.route('/logout').get(function(req,res){
		req.logout();
		res.redirect('/');
	});

module.exports = router;
