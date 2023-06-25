let { Schema, model, models } = require('mongoose');

let reqString = {
	type: String,
	required: true,
};

let summarySchema = new Schema({
	summaryName: reqString,
	value: reqNum,
	msgId: String,
});

module.exports = models['summary'] || model('summary', summarySchema);