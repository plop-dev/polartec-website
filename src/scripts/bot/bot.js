import { Client, GatewayIntentBits } from 'discord.js';
import { ActionRowBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import nodemailer from 'nodemailer';
import juice from 'juice';
import ejs from 'ejs';
import path, { dirname } from 'path';

import registerCommands from './statusControl';
await registerCommands();

import Order from '../../schemas/order';
import dotenv from 'dotenv';
dotenv.config();
const { BOT_TOKEN, CLIENT_ID, CLIENT_SECRET, EMAIL_APP_PASSWORD } = process.env;
const __dirname = path.resolve(dirname(''));

const client = new Client({
	intents: [GatewayIntentBits.Guilds],
});

function getFieldValues(interaction, fieldName) {
	return interaction.message.embeds[0].data.fields.find(field => field.name === fieldName).value;
}

client.on('interactionCreate', async interaction => {
	if (interaction.customId === 'showModalButton') {
		await interaction.message.edit({ content: `\`\`\`md\nAwaiting user response. **DO NOT PRINT YET!**\n\`\`\`` });

		const modal = new ModalBuilder().setCustomId('priceModal').setTitle('Order Price');

		const priceInput = new TextInputBuilder().setCustomId('priceInput').setLabel('Enter the price of the order (number)').setStyle(TextInputStyle.Short);
		const messageInput = new TextInputBuilder()
			.setCustomId('messageInput')
			.setLabel('Enter a message to send to the user')
			.setStyle(TextInputStyle.Paragraph)
			.setRequired(false);

		const priceInputRow = new ActionRowBuilder().addComponents(priceInput);
		const messageInputRow = new ActionRowBuilder().addComponents(messageInput);
		modal.addComponents(priceInputRow, messageInputRow);

		await interaction.showModal(modal);
	} else if (interaction.customId === 'priceModal') {
		const priceInput = interaction.fields.getTextInputValue('priceInput');
		const customMessageInput =
			interaction.fields.getTextInputValue('messageInput') === ''
				? ''
				: `<br>A note from Szymon: ${interaction.fields.getTextInputValue('messageInput')}`;

		const userEmail = getFieldValues(interaction, 'Email');
		const userName = userEmail.split('@')[0];
		const colour = getFieldValues(interaction, 'Colour');
		const plasticType = getFieldValues(interaction, 'Plastic type');
		const layerHeight = getFieldValues(interaction, 'Layer height');
		const infill = getFieldValues(interaction, 'Infill (%)');
		const customId = getFieldValues(interaction, 'Custom ID');

		if (isNaN(priceInput)) {
			await interaction.reply({ content: `A number has to be entered (don't put any symbols like '£')`, ephemeral: true });
		} else {
			await interaction.reply({ content: `Received price and message succesfully.\nEmail is being sent to the user...`, ephemeral: true });

			const transporter = nodemailer.createTransport({
				host: 'smtp.gmail.com',
				port: 465,
				secure: true, // use SSL
				auth: {
					user: 'Contact.PolarTec@gmail.com',
					pass: EMAIL_APP_PASSWORD,
				},
				tls: {
					rejectUnauthorized: false,
					requestCert: true,
				},
			});

			ejs.renderFile(
				__dirname + '/src/emails/templates/confirm.ejs',
				{ userName, price: priceInput, colour, plasticType, layerHeight, infill, customMessageInput, customId },
				async (error, html) => {
					if (error) {
						console.log('An error occured: ' + error.message + '\n' + error);
					} else {
						const data = juice(html);
						const confirmationEmail = await transporter.sendMail({
							from: 'Contact.PolarTec@gmail.com',
							to: 'plop@leafbot.dev',
							subject: 'Confirm your order',
							html: data,
						});
					}
				},
			);
		}
	} else if (interaction.commandName === 'status') {
		await interaction.deferReply({ ephemeral: true });

		const id = interaction.options.get('id').value;
		const status = interaction.options.get('status').value;

		try {
			const order = await Order.findOneAndUpdate({ randomId: id }, { $set: { status: status } });
			if (!order) {
				return await interaction.editReply({
					content: `Order not found. Make sure you've copied the id correctly and that the order is still available.`,
				});
			}

			await interaction.editReply({ content: `Order \`${id}\`'s status has succesfully been updated to \`${status}\`.` });
		} catch (error) {
			console.log('An error occured: ' + error.message + '\n' + error);
			await interaction.editReply({ content: `An error occured whilst trying to change the status. Try again later or contact \`plop_dev\`.` });
		}
	}
});

client.login(BOT_TOKEN).then(() => {
	console.log(`${client.user.tag} is online!`);
});

export default client;
