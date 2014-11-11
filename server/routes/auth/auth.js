var auth = app.modules.express.Router();

auth.use('/google',require('../../routes/auth/google-auth'));

module.exports = auth;
