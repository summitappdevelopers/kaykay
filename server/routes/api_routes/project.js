var project = app.modules.express.Router();

var notFoundError = {message:"This resource was not found"};

//====== PROJECT ROUTES ======

project.route('/create')
	.post(function(req,res){
		
		req.body.name = req.body.name.toLowerCase().replace(/[_\W]+/g, "");

		var newProject = new app.models.Project();
		newProject.title = req.body.title;
		newProject.creatorID = req.user.id;
		newProject.creatorDisplayName = req.user.displayName;

		newProject.save(function(err){
			if(err){
				console.log(err);
			}
		});

	});


project.route('/edit/:_id')
	.post(function(req,res){
		app.models.Project.findOne({'_id':req.params._id}, function(err, project){
			if(project){
				if(project.creatorID == req.user.id){
					//so far only title will be editable. 
					newProject.title = req.body.title;
				}
			}
			else{
				res.status(404);
				res.json(notFoundError);
			}
		});
	});


project.route('/remove/:id')
	.post(app.utilities.ensureAuthenticated, function(req,res){
		app.models.Project.findOne({'_id':req.params.id}, function(err, project){
			if(project){
				if(slink.creatorID == req.user.id){

					req.user.projects.splice(req.user.projects.indexOf(project),1);
					req.user.save(function(err){
						res.json({status:1, message:"Project removed successfully"});
						if(err)console.log(err);
					});


				}
			}
			else{
				res.status(404);
				res.json(notFoundError);
			}
		});
	});


//====== PROJECT kaycard ROUTES ======

project.route('/:id/kaycard/create')
	.post(function(req, res) {


		app.models.Project.findOne({'_id':req.params.id}, function(err, project){
			if(project){

				var newKaycard = new app.models.Kaycard();
				newKaycard.title = req.body.title;
				newKaycard.description = req.body.description;
				newKaycard.asssignedTo = req.body.asssignedTo;
				newKaycard.top = req.body.top;
				newKaycard.left = req.body.left;
				newKaycard.width = req.body.width;
				newKaycard.projectID = project._id;
				newKaycard.creatorID = project.creatorID;
				newKaycard.save(function(err){
					if(err){
						console.log(err);
					}else{
						res.json(newKaycard);
						}
				});
				project.kayCards.push(newKaycard);
				project.save(function(err){
					if(err){
						console.log(err);
					}
				});

			}else{
				res.status(404);
				res.json(notFoundError);
			}
		});

	});

project.route('/:id/kaycard/edit/:kid')
	.post(function(req, res) {

		app.models.Project.findOne({'_id':req.params.id}, function(err, project){
			if(project){

				app.models.Kaycard.findOne({'_id':req.params.kid}, function(err, kaycard){
					if(kaycard){
						if(kaycard.creatorID == req.user.id && kaycard.projectID == project._id){
							kaycard.title = req.body.title;
							kaycard.description = req.body.description;
							kaycard.asssignedTo = req.body.asssignedTo;
							kaycard.top = req.body.top;
							kaycard.left = req.body.left;
							kaycard.width = req.body.width;
							kaycard.save(function(err){
								if(err)console.log(err);
							});
						}
					}else{
						res.status(404);
						res.json(notFoundError);
					}
				});

			}else{
				res.status(404);
				res.json(notFoundError);
			}

		});

	});


project.route('/:id/kaycard/remove/:kid')
	.post(function(req, res) {

		app.models.Project.findOne({'_id':req.params.id}, function(err, project){
			if(project){

				app.models.Kaycard.findOne({'_id':req.params.kid}, function(err, kaycard){
					if(kaycard){
						if(kaycard.creatorID == req.user.id && kaycard.projectID == project._id){
							kaycard.remove(function(err){
								if(err)console.log(err);
							});
						}
					}else{
						res.status(404);
						res.json(notFoundError);
					}
				});

			}else{
				res.status(404);
				res.json(notFoundError);
			}

		});

	});


project.route('/:id')
	.get(function(req, res) {
		console.log(req.params.name);
		app.models.Project.findOne({ '_id': req.params.id }, function(err, project) {
			if(project){
				res.json(project);
			}
			else{
				res.status(404);
				res.json(notFoundError);
			}
		});
	});



module.exports = project;
