var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var UserSchema = new Schema({
	displayName: String,
	firstName: String,
	nickName: String,
	picture: String,
	// id: String,
	email: String,
	projects: Array,
});

module.exports = mongoose.model('User', UserSchema);
