let dbCmds = require('./dbCmds.js');
let { EmbedBuilder } = require('discord.js');

module.exports.postEmbed = async (client) => {
	let allProjects = await dbCmds.getAllProjects();
	let projectsDescList = '';

	allProjects.sort((a, b) => {
		let fa = a.displayName.toLowerCase(),
			fb = b.displayName.toLowerCase();
		if (fa < fb) { return -1; }
		if (fa > fb) { return 1; }
		return 0;
	});

	for (let i = 0; i < allProjects.length; i++) {
		if (allProjects[i].status == 'active' || allProjects[i].status == 'indevelopment') {
			if (allProjects[i].status == 'active') {
				projectsDescList = projectsDescList.concat(`**${allProjects[i].displayName}**: 🟢`);
			} else if (allProjects[i].status == 'indevelopment') {
				projectsDescList = projectsDescList.concat(`**${allProjects[i].displayName}**: 🟡`);
			}
		} else if (allProjects[i].status == 'inactive') {
			projectsDescList = projectsDescList.concat(`**${allProjects[i].displayName}**: ⚫`);
		} else {
			projectsDescList = projectsDescList.concat(`**${allProjects[i].displayName}**: ❓`);
		}
	}

	// status color palette: https://coolors.co/palette/d7f2f8-e7e9e5-d3ffce-ffface-ffced3

	let projectsEmbed;

	if (projectsDescList != '') {
		projectsEmbed = new EmbedBuilder()
			.setTitle(`R&C Development Projects`)
			.setDescription(projectsDescList)
			.setColor('D7F2F8');
	} else {
		projectsEmbed = new EmbedBuilder()
			.setTitle(`R&C Development Projects`)
			.setDescription('R&C Development has no projects at this time...')
			.setColor('D7F2F8');
	}

	client.embedMsg = await client.channels.cache.get(process.env.EMBED_CHANNEL_ID).send({ embeds: [projectsEmbed] });

	await dbCmds.setMsgId("embedMsg", client.embedMsg.id);
};