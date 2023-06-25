let { Schema, model, models } = require('mongoose');

let reqString = {
	type: String,
	required: true,
};

let projectsSchema = new Schema({
	uniqueName: reqString,
	cleanName: reqString,
	status: reqString,
});

module.exports = models['projects'] || model('projects', projectsSchema);