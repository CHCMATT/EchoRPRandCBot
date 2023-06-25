let moment = require('moment');
let dbCmds = require('./dbCmds.js');
let { EmbedBuilder } = require('discord.js');

module.exports.postEmbed = async (client) => {
	try {
		let allProjects = await dbCmds.getAllProjects();
		let projectsDescList = '';

		allProjects.sort((a, b) => {
			return a.orderedTime - b.orderedTime;
		});

		for (let i = 0; i < allProjects.length; i++) {
			if (allProjects[i].status == 'active' || allProjects[i].status == 'indevelopment') {
				if (allProjects[i].status == 'active') {
					projectsDescList = projectsDescList.concat(`**${allProjects[i].displayName}**: 🟢\n`);
				} else if (allProjects[i].status == 'indevelopment') {
					projectsDescList = projectsDescList.concat(`**${allProjects[i].displayName}**: 🟡\n`);
				}
			} else if (allProjects[i].status == 'inactive') {
				projectsDescList = projectsDescList.concat(`**${allProjects[i].displayName}**: 🔴\n`);
			} else {
				projectsDescList = projectsDescList.concat(`**${allProjects[i].displayName}**: ❓\n`);
			}
		}

		// status color palette: https://coolors.co/palette/d7f2f8-e7e9e5-d3ffce-ffface-ffced3

		let projectsEmbed;

		if (projectsDescList != '') {
			projectsEmbed = new EmbedBuilder()
				.setTitle(`R&C Development Projects`)
				.setDescription(projectsDescList)
				.setColor('D7F2F8')
				.setFooter({ 'text': '🟢 active\n🟡 in progress\n🔴 inactive' });
		} else {
			projectsEmbed = new EmbedBuilder()
				.setTitle(`R&C Development Projects`)
				.setDescription('R&C Development has no projects at this time...')
				.setColor('D7F2F8');
		}

		client.embedMsg = await client.channels.cache.get(process.env.EMBED_CHANNEL_ID).send({ embeds: [projectsEmbed] });

		await dbCmds.setMsgId("embedMsg", client.embedMsg.id);
	} catch (error) {
		let errTime = moment().format('MMMM Do YYYY, h:mm:ss a');;
		let fileParts = __filename.split(/[\\/]/);
		let fileName = fileParts[fileParts.length - 1];

		let errorEmbed = [new EmbedBuilder()
			.setTitle(`An error occured on the ${process.env.BOT_NAME} bot file ${fileName}!`)
			.setDescription(`\`\`\`${error.toString().slice(0, 2000)}\`\`\``)
			.setColor('B80600')
			.setFooter({ text: `${errTime}` })];

		await client.channels.cache.get(process.env.ERROR_LOG_CHANNEL_ID).send({ embeds: errorEmbed });

		console.log(`Error occured at ${errTime} at file ${fileName}!`);
		console.error(error);
	}
};