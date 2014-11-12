var api_manager = app.modules.express.Router();

api_manager.use('/project',require('../routes/api_routes/project'));
api_manager.use('/user',require('../routes/api_routes/user'));

module.exports = api_manager;
