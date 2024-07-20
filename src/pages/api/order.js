import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import Order from '../../schemas/order';
import client from '../../scripts/bot/bot';
import randomId from '../../tools/randomId';

export const prerender = false;
export const POST = async ({ request, cookies }) => {
	const body = await request.json().then(res => res);
	const { fileData, fileName, mimeType, userEmail, customMessage, colour, plasticType, layerHeight, infill } = body;
	const currentDate = Date.now();
	const userId = cookies.get('userId').value.split('*SID-')[0];
	const receivedFileBuffer = Buffer.from(fileData, 'base64');

	const orderChannelId = '1164312818770788513'; // testing channel for now
	try {
		const channel = await client.channels.fetch(orderChannelId).then(res => res);
		if (channel) {
			const rid = randomId();
			const embed = new EmbedBuilder()
				.setTitle('New Order')
				.setDescription(`**${userEmail.split('@')[0]}** has just ordered something!\n`)
				.addFields(
					{ name: 'Email', value: userEmail, inline: true },
					{ name: 'Custom message', value: customMessage == '' ? 'No message provided' : customMessage, inline: true },
					{ name: 'Colour', value: colour, inline: true },
					{ name: 'Plastic type', value: plasticType, inline: true },
					{ name: 'Layer height', value: layerHeight, inline: true },
					{ name: 'Infill (%)', value: `${infill}%`, inline: true },
					{ name: 'Custom ID', value: `${rid}` },
				)
				.setTimestamp()
				.setColor([130, 180, 210]);

			const button = new ButtonBuilder().setCustomId('showModalButton').setLabel('Enter price').setStyle(ButtonStyle.Primary);

			const message = await channel.send({
				content: `\`\`\`md\nEnter the price to send an email to the user. **DO NOT PRINT YET!**\n\`\`\``,
				embeds: [embed],
				files: [{ attachment: receivedFileBuffer, name: fileName }],
				components: [new ActionRowBuilder().addComponents(button)],
			});

			const fileLink = message.attachments.first().url;

			const res = await Order.create({
				randomId: rid,
				userId,
				userEmail,
				customMessage,
				colour,
				plasticType,
				layerHeight,
				infill,
				fileName,
				fileLink,
			});
		}
	} catch (error) {
		console.log('An error occured: ' + error.message + '\n' + error);
	}

	return new Response(null, { status: 200 });
};
