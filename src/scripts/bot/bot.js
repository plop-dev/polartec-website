import { Client, GatewayIntentBits } from 'discord.js';
import { ActionRowBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import nodemailer from 'nodemailer';
import juice from 'juice';
import ejs from 'ejs';
import path, { dirname } from 'path';

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
				{ userName, price: priceInput, colour, plasticType, layerHeight, infill, customMessageInput },
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
	}
});

client.login(BOT_TOKEN).then(() => {
	console.log(`${client.user.tag} is online!`);
});

export default client;
