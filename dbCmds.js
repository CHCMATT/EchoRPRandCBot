let projects = require('./schemas/projects');
let summary = require('./schemas/summary');

// for setting message ID of current Discord embed message
module.exports.setMsgId = async (summaryName, newValue) => {
	await summary.findOneAndUpdate({ summaryName: summaryName }, { msgId: newValue }, { upsert: true });
};

module.exports.readMsgId = async (summaryName) => {
	let result = await summary.findOne({ summaryName }, { msgId: 1, _id: 0 });
	if (result !== null) {
		return result.msgId;
	}
	else {
		return `Value not found for ${summaryName}.`;
	}
};


// for creating and setting project statuses
module.exports.setProjStatus = async (uName, newStatus) => {
	await projects.findOneAndUpdate({ uniqueName: uName }, { status: newStatus }, { upsert: true });
	let result = await projects.findOne({ uniqueName: uName }, { displayName: 1, _id: 0 });
	return result.displayName;
};

// for creating and setting project statuses
module.exports.createProj = async (uName, cName, newStatus) => {
	await projects.findOneAndUpdate({ uniqueName: uName }, { uniqueName: uName, displayName: cName, status: newStatus }, { upsert: true });
};

module.exports.readProjStatus = async (uName) => {
	let result = await projects.findOne({ uniqueName: uName }, { displayName: 1, status: 1, _id: 0 });
	if (result !== null) {
		return result.status;
	}
	else {
		return `unknown`;
	}
};

module.exports.getAllProjects = async () => {
	let result = await projects.find({ displayName: { $ne: null } }, { uniqueName: 1, displayName: 1, status: 1, _id: 0 });
	return result;
};