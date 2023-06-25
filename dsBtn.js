const dbCmds = require('./dbCmds.js');
const editEmbed = require('./editEmbed.js');
const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports.btnPressed = async (interaction) => {
	try {
		const buttonID = interaction.customId;
		switch (buttonID) {
			case '':
				break;
			default:
				await interaction.reply({ content: `I'm not familiar with this button press. Please tag @CHCMATT to fix this issue.`, ephemeral: true });
				console.log(`Error: Unrecognized button press: ${interaction.customId}`);
		}
	}
	catch (error) {
		console.log(`Error in button press!`);
		console.error(error);
	}
};