let dbCmds = require('../dbCmds.js');
let editEmbed = require('../editEmbed.js');
let { PermissionsBitField, time } = require('discord.js');

module.exports = {
	name: 'newproject',
	description: 'Creates a new project',
	options: [
		{
			name: 'uniquename',
			description: 'The unique name of the project',
			type: 3,
			required: true,
		},
		{
			name: 'diplayname',
			description: 'The unique name of the project',
			type: 3,
			required: true,
		},
		{
			name: 'status',
			description: 'The status of the project',
			choices: [
				{ name: 'Active', value: 'active' },
				{ name: 'Inactive', value: 'inactive' },
				{ name: 'In Development', value: 'indevelopment' },
			],
			type: 3,
			required: true,
		},
		{
			name: 'orderedtime',
			description: 'The unix timestamp of when it was ordered (if left blank, defaults to now)',
			type: 4,
			required: false,
		},
	],
	async execute(interaction) {
		try {
			if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
				let uniqueName = interaction.options.getString('uniquename');
				let diplayName = interaction.options.getString('diplayname');
				let newStatus = interaction.options.getString('status');
				let orderedTime = interaction.options.getInteger('orderedtime');

				if (orderedTime == null) {
					orderedTime = Math.floor(new Date().getTime() / 1000.0)
				}

				await dbCmds.createProj(uniqueName, diplayName, newStatus, orderedTime);

				await editEmbed.editEmbed(interaction.client);

				let today = new Date();
				let nowTime = time(today, 't');

				await interaction.client.channels.cache.get(process.env.PROJECT_LOGS_CHANNEL_ID).send(`\`${interaction.member.nickname}\` created a new project titled \`${diplayName}\` with status \`${newStatus}\` at ${nowTime}.`);

				await interaction.reply({ content: `✅ Successfully created a new project titled \`${diplayName}\` that started at ${time(orderedTime)} with status \`${newStatus}\`.`, ephemeral: true });
			}
			else {
				await interaction.reply({ content: `:x: You must have the \`Administrator\` permission to use this function.`, ephemeral: true });
			}
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
	},
};

