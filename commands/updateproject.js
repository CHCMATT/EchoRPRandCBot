const dbCmds = require('../dbCmds.js');
const editEmbed = require('../editEmbed.js');
const { PermissionsBitField, time } = require('discord.js');

module.exports = {
	name: 'updateproject',
	description: 'Updates the status of an existing project',
	options: [
		{
			name: 'projectname',
			description: 'The name of the project',
			choices: [
				{ name: 'CID Bot', value: 'cidBot' },
				{ name: 'Dynasty 8 Bot', value: 'd8Bot' },
				{ name: 'Luxury Autos Bot', value: 'laBot' },
				{ name: 'Pegasus Airlines Bot', value: 'pegasusBot' },
				{ name: 'UpTown Autos Bot', value: 'uptownBot' },
				{ name: 'Blackwoods Bot', value: 'blackwoodsBot' },
				{ name: 'Empire Imports Bot', value: 'empireBot' },
				{ name: 'Dynasty 8 Raffle Bot', value: 'd8RaffleBot' },
				{ name: 'Benny\'s Raffle Bot', value: 'bennysRaffleBot' },
				{ name: 'Bug Bot', value: 'bugBot' },
				{ name: 'Dynasty 8 Website', value: 'd8Site' },
				{ name: 'Los Santos Security Website', value: 'lssSite' },
				{ name: 'Luxury Autos Website', value: 'laSite' },
			],
			type: 3,
			required: true,
		},
		{
			name: 'newstatus',
			description: 'The new status of the project',
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
			const projectName = interaction.options.getString('projectname');
			const newStatus = interaction.options.getString('newstatus');

			let displayName = await dbCmds.setProjStatus(projectName, newStatus)

			await editEmbed.editEmbed(interaction.client);

			let today = new Date();
			let nowTime = time(today, 't');

			await interaction.client.channels.cache.get(process.env.PROJECT_LOGS_CHANNEL_ID).send(`\`${interaction.member.nickname}\` modified the status of project \`${displayName}\` to \`${newStatus}\` at ${nowTime}.`);

			await interaction.reply({ content: `✅ Successfully modified the status of project \`${displayName}\` to \`${newStatus}\`.`, ephemeral: true });
		}
		else {
			await interaction.reply({ content: `:x: You must have the \`Administrator\` permission to use this function.`, ephemeral: true });
		}
	},
};