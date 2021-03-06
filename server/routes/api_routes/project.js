var project = app.modules.express.Router();

//====== PROJECT ROUTES ======

project.route('/:id').get(app.utilities.ensureAuthenticated,function(req, res) {
	app.models.Project.findOne({ _id: req.params.id, creatorID: req.user.id}, function(err, project) {
		if(err){
			throw err;
		}

		if(project){
			res.json({
				ok: true,
				message: 'Success!',
				data: project
			});
		}else{
			res.json({
				ok: false,
				message: 'This resource was not found!',
				data: null
			});
		}
	});
});

project.route('/create').post(app.utilities.ensureAuthenticated,function(req,res){
	var newProject = new app.models.Project();
	newProject.title = req.body.title;
	newProject.creatorID = req.user.id;
	newProject.creatorDisplayName = req.user.displayName;
	newProject.creationDate = new Date();
	newProject.dateDisplay = app.modules.moment(newProject.creationDate).format('MMMM Do');
	newProject.save(function(err){
		if(err){
			throw err;
		} else {
			res.json({
				ok: true,
				message: 'Success!',
				data: newProject
			});
		}
	});
});

project.route('/:id/edit').post(app.utilities.ensureAuthenticated,function(req,res){
	app.models.Project.findOne({ _id: req.params.id, creatorID: req.user.id }, function(err, project){
		if(err){
			throw err;
		}

		if(project){
			//so far only title will be editable.
			project.title = req.body.title;
			project.save(function(err){
				if(err){
					throw err;
				}
				else{
					res.json({
						ok: true,
						message: 'Success!',
						data: project
					});
				}

			});

		}else{
			res.json({
				ok: false,
				message: 'This resource was not found!',
				data: null
			});
		}
	});
});

project.route('/:id/remove').get(app.utilities.ensureAuthenticated, function(req,res){
	app.models.Project.findOne({ _id: req.params.id, creatorID: req.user.id }, function(err, project){
		if(err){
			throw err;
		}

		if(project){

			app.models.Kaycard.remove({projectID:req.params.id},function(err){
				if(err){
					throw err;
				}
			});

			project.remove(function(err){
				if(err){
					throw err;
				}else{
					res.json({
						ok: true,
						message: 'Success!',
						data: null
					});
				}
			});
		}else{
			res.json({
				ok: false,
				message: 'This resource was not found!',
				data: null
			});
		}
	});
});

//====== KAYCARD ROUTES ======

project.route('/:id/kaycard/create').post(app.utilities.ensureAuthenticated, function(req, res) {
	app.models.Project.findOne({ _id: req.params.id}, function(err, project){
		if (err) {
			throw err;
		}

		if(project){
			var newKaycard = new app.models.Kaycard({
				title: req.body.title,
				description: req.body.description,
				asssignedTo: req.body.asssignedTo,
				top: req.body.top,
				left: req.body.left,
				width: req.body.width,
				projectID: project._id,
				creatorID: project.creatorID
			});

			newKaycard.save(function(err){
				if(err){
					throw err;
				}else{
					res.json({
						ok: true,
						message: 'Success!',
						data: newKaycard
					});
				}
			});
		}else{
			res.json({
				ok: false,
				message: 'This resource was not found!',
				data: null
			});
		}
	});
});

project.route('/:id/kaycard/:kid/edit').post(app.utilities.ensureAuthenticated, function(req, res) {
	app.models.Kaycard.findOne({ _id: req.params.kid, creatorID: req.user.id, projectID: req.params.id }, function(err, kaycard) {
		if (err) {
			throw err;
		}

		if(kaycard) {
			req.body.title && (kaycard.title = req.body.title);
			req.body.description && (kaycard.description = req.body.description);
			req.body.asssignedTo && (kaycard.asssignedTo = req.body.asssignedTo);
			req.body.top && (kaycard.top = req.body.top);
			req.body.left && (kaycard.left = req.body.left);
			req.body.width && (kaycard.width = req.body.width);

			kaycard.save(function(err){
				if(err){
					throw err;
				} else {
					res.json({
						ok: true,
						message: 'Success!',
						data: kaycard
					});
				}
			});
		} else {
			res.json({
				ok: false,
				message: 'This resource was not found!',
				data: null
			});
		}
	});
});

project.route('/:id/kaycard/:kid/remove').get(app.utilities.ensureAuthenticated, function(req, res) {
	app.models.Kaycard.findOne({ _id: req.params.kid, projectID:req.params.id, creatorID: req.user.id }, function(err, kaycard){
		if(err){
			throw err;
		}

		if(kaycard){
			kaycard.remove(function(err){
				if(err) {
					throw err;
				} else {
					res.json({
						ok: true,
						message: 'Success!',
						data: null
					});
				}
			});
		}else{
			res.json({
				ok: false,
				message: 'This resource was not found!',
				data: null
			});
		}
	});
});

project.route('/:id/kaycard/all').get(app.utilities.ensureAuthenticated, function(req,res){
	app.models.Kaycard.find({ projectID: req.params.id, creatorID: req.user.id }, function(err,kaycards){
		if (kaycards.length !== 0) {
			res.json({
				ok: true,
				message: 'Success!',
				data: kaycards
			});
		} else {
			res.json({
				ok: false,
				message: 'This resource was not found!',
				data: null
			});
		}
	});
});

module.exports = project;
