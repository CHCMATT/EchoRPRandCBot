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
				.setFooter({ 'text': '🟢 active, 🟡 in development, 🔴 inactive' });
		} else {
			projectsEmbed = new EmbedBuilder()
				.setTitle(`R&C Development Projects`)
				.setDescription('R&C Development has no projects at this time...')
				.setColor('D7F2F8');
		}

		client.embedMsg = await client.channels.cache.get(process.env.EMBED_CHANNEL_ID).send({ embeds: [projectsEmbed] });

		await dbCmds.setMsgId("embedMsg", client.embedMsg.id);
	} catch (error) {
		if (process.env.BOT_NAME == 'test') {
			let errTime = moment().format('MMMM Do YYYY, h:mm:ss a');
			let fileParts = __filename.split(/[\\/]/);
			let fileName = fileParts[fileParts.length - 1];

			console.error(errTime, fileName, error);
		} else {
			let errTime = moment().format('MMMM Do YYYY, h:mm:ss a');
			let fileParts = __filename.split(/[\\/]/);
			let fileName = fileParts[fileParts.length - 1];
			console.error(errTime, fileName, error);

			console.log(`An error occured at ${errTime} at file ${fileName} and was created by ${interaction.member.nickname} (${interaction.member.user.username}).`);

			let errString = error.toString();
			let errHandled = false;

			if (errString === 'Error: The service is currently unavailable.' || errString === 'Error: Internal error encountered.' || errString === 'HTTPError: Service Unavailable') {
				try {
					await interaction.editReply({ content: `:warning: One of the service providers we use had a brief outage. Please try to submit your request again!`, ephemeral: true });
				} catch {
					await interaction.reply({ content: `:warning: One of the service providers we use had a brief outage. Please try to submit your request again!`, ephemeral: true });
				}
				errHandled = true;
			}

			let errorEmbed = [new EmbedBuilder()
				.setTitle(`An error occured on the ${process.env.BOT_NAME} bot file ${fileName}!`)
				.setDescription(`\`\`\`${errString}\`\`\``)
				.addFields(
					{ name: `Created by:`, value: `${interaction.member.nickname} (<@${interaction.user.id}>)`, inline: true },
					{ name: `Error handled?`, value: `${errHandled}`, inline: true },
				)
				.setColor('B80600')
				.setFooter({ text: `${errTime}` })];

			await interaction.client.channels.cache.get(process.env.ERROR_LOG_CHANNEL_ID).send({ embeds: errorEmbed });
		}
	}
};