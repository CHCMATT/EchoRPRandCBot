let { Schema, model, models } = require('mongoose');

let reqString = {
	type: String,
	required: true,
};

let reqNum = {
	type: Number,
	required: true,
};

let projectsSchema = new Schema({
	uniqueName: reqString,
	displayName: reqString,
	status: reqString,
	orderedTime: reqNum,
});

module.exports = models['projects'] || model('projects', projectsSchema);