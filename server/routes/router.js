var router = app.modules.express.Router();

router.route('/').get(function(req,res){
	if(req.user){
		res.render('projects',{user:req.user});
	} else{
		res.send('<h1>Welcome to KK</h1> <button onclick="window.location.href = \'/auth/google\';">Login with Google</button>');
	}
});

router.route('/project/:id').get(app.utilities.ensureAuthenticatedFancy,function(req,res){
	res.render('project',{id:req.params.id,user:req.user});
});

router.route('/logout').get(function(req,res){
	req.logout();
	res.redirect('/');
});

module.exports = router;
