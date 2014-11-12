var user = app.modules.express.Router();

//====== PROJECT ROUTES ======
// These routes are for viewing other accounts.

user.route('/:id').get(app.utilities.ensureAuthenticated, function(req, res) {
	app.models.User.findOne({ _id: req.params.id }, function(err, user) {
		if (err) {
			throw err;
		}

		if (user) {
			delete user.email;
			delete user.firstName;
			delete user.id;
			delete user._id;
			delete user.__v;

			res.json({
				ok: true,
				message: 'Success!',
				data: user
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

user.route('/:id/projects').get(app.utilities.ensureAuthenticated, function(req, res) {
	app.models.User.findOne({ _id: req.param.id }, function(err, user) {
		if (err) {
			throw err;
		} else {
			app.models.Project.find({ creatorID: req.params.id }, function(err, projects) {
				if (err) {
					throw err;
				}

				for (var iter = 0; iter < projects.length; iter++) {
					delete projects[iter].collaborators;
				}

				res.json({
					ok: true,
					message: 'Success!',
					data: projects
				});
			});
		}
	});
});

//====== PROJECT ROUTES ======
// These routes are for internal use.

user.route('/').get(app.utilities.ensureAuthenticated, function(req, res) {
	app.models.User.findOne({ _id: req.user.id }, function(err, user) {
		if (err) {
			throw err;
		}

		if (user) {
			res.json({
				ok: true,
				message: 'Success!',
				data: user
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

user.route('/projects').get(app.utilities.ensureAuthenticated, function(req, res) {
	app.models.User.findOne({ _id: req.user.id }, function(err, user) {
		if (err) {
			throw err;
		} else {
			app.models.Project.find({ creatorID: req.params.id }, function(err, projects) {
				if (err) {
					throw err;
				}

				for (var iter = 0; iter < projects.length; iter++) {
					delete projects[iter].collaborators;
				}

				res.json({
					ok: true,
					message: 'Success!',
					data: projects
				});
			});
		}
	});
});

module.exports = user;
