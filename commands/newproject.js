const dbCmds = require('../dbCmds.js');
const editEmbed = require('../editEmbed.js');
const { PermissionsBitField } = require('discord.js');

module.exports = {
	name: 'newproject',
	description: 'Creates a new project',
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
				{ name: 'In Development', value: 'inDevelopment' },
			],
			type: 3,
			required: true,
		},
	],
	async execute(interaction) {
		if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
			const projectname = interaction.options.getString('projectname');
			const newstatus = interaction.options.getString('newstatus');

			if (counterName === "search") {
				await dbCmds.addValue("countSearchWarrants", value);
				var newValue = await dbCmds.readValue("countSearchWarrants");
				var fixedName = "Search Warrants";
			}
			if (counterName === "subpoenas") {
				await dbCmds.addValue("countSubpoenas", value);
				var newValue = await dbCmds.readValue("countSubpoenas");
				var fixedName = "Subpoenas";
			}
			if (counterName === "money") {
				await dbCmds.addValue("countMoneySeized", value);
				var newValue = formatter.format(await dbCmds.readValue("countMoneySeized"));
				var fixedName = "Money Seized";
			}
			if (counterName === "guns") {
				await dbCmds.addValue("countGunsSeized", value);
				var newValue = await dbCmds.readValue("countGunsSeized");
				var fixedName = "Guns Seized";
			}
			if (counterName === "drugs") {
				await dbCmds.addValue("countDrugsSeized", value);
				var newValue = await dbCmds.readValue("countDrugsSeized");
				var fixedName = "Drugs Seized";
			}
			if (counterName === "calls") {
				await dbCmds.addValue("countCallsAttended", value);
				var newValue = await dbCmds.readValue("countCallsAttended");
				var fixedName = "Calls Attended";
			}
			await editEmbed.editEmbed(interaction.client);
			await interaction.reply({ content: `Successfully added \`${value}\` to the \`${fixedName}\` counter - the new total is \`${newValue}\`.`, ephemeral: true });

			await interaction.client.channels.cache.get(process.env.AUDIT_CHANNEL_ID).send(`:warning: \`${interaction.member.nickname}\` (\`${interaction.member.user.username}\`) added \`${value}\` to the \`${fixedName}\` counter for a new total of \`${newValue}\`.`)
		}
		else {
			await interaction.reply({ content: `:x: You must have the \`Full Time Detective\` role or the \`Administrator\` permission to use this function.`, ephemeral: true });
		}
	},
};

