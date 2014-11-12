var user = app.modules.express.Router();

//====== PROJECT ROUTES ======
// These routes are for internal use.

user.route('/').get(app.utilities.ensureAuthenticated, function(req, res) {
	app.models.User.findOne({ id: req.user.id }, function(err, user) {
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
	app.models.Project.find({ creatorID: req.user.id }, function(err, projects) {
		if (err) {
			throw err;
		} else {
			res.json({
				ok: true,
				message: 'Success!',
				data: projects
			});
		}
	});
});

module.exports = user;
