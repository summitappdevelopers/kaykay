var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var KaycardSchema = new Schema({
	title: String,
	description: String,
	assignedTo: Array,
	top: Number,
	left: Number,
	width: Number,
	creatorID: String,
	projectID: String
});

module.exports = mongoose.model('KaycardSchema', KaycardSchema);
