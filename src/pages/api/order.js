import { EmbedBuilder } from 'discord.js';
import Order from '../../schemas/order';
import client from '../../scripts/bot/bot';

export const prerender = false;
export const POST = async ({ request, cookies }) => {
	const body = await request.json().then(res => res);
	const { fileData, fileName, mimeType, userEmail, customMessage, colour, plasticType, layerHeight, infill } = body;
	const userId = cookies.get('userId').value.split('*SID-')[0];
	const receivedFileBuffer = Buffer.from(fileData, 'base64');

	const orderChannelId = '1164312818770788513'; // testing channel for now
	try {
		const channel = await client.channels.fetch(orderChannelId).then(res => res);
		if (channel) {
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
				)
				.setTimestamp()
				.setColor([130, 180, 210]);

			const message = await channel.send({ embeds: [embed], files: [{ attachment: receivedFileBuffer, name: fileName }] });

			const fileLink = message.attachments.first().url;

			const res = await Order.create({
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
		console.log(error);
	}

	return new Response(null, { status: 200 });
};
