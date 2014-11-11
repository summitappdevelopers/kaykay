var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var Kaycard = new Schema({
	title: String,
	description: String,
	assignedTo: Array,
	top: Number,
	left: Number,
	width: Number,
	creatorID: String,
	projectID: String
});

module.exports = mongoose.model('Kaycard', Kaycard);
