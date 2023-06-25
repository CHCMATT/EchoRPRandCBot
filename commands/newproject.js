const dbCmds = require('../dbCmds.js');
const editEmbed = require('../editEmbed.js');
const { PermissionsBitField, time } = require('discord.js');

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
	],
	async execute(interaction) {
		if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
			const uniqueName = interaction.options.getString('uniquename');
			const diplayName = interaction.options.getString('diplayname');
			const newStatus = interaction.options.getString('status');

			await dbCmds.createProj(uniqueName, diplayName, newStatus);

			await editEmbed.editEmbed(interaction.client);

			let today = new Date();
			let nowTime = time(today, 't');

			await interaction.client.channels.cache.get(process.env.PROJECT_LOGS_CHANNEL_ID).send(`\`${interaction.member.nickname}\` created a new project titled \`${diplayName}\` with status \`${newStatus}\` at ${nowTime}.`);

			await interaction.reply({ content: `✅ Successfully created a new project titled \`${diplayName}\` with status \`${newStatus}\`.`, ephemeral: true });
		}
		else {
			await interaction.reply({ content: `:x: You must have the \`Administrator\` permission to use this function.`, ephemeral: true });
		}
	},
};

