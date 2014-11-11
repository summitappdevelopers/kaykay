var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var ProjectSchema = new Schema({
	title: String,
	collaborators: Array,
	creatorID: String,
	creatorDisplayName: String
});

module.exports = mongoose.model('Project', ProjectSchema);
