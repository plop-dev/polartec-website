import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
} from 'discord.js';
import Order from '../../schemas/order';
import client from '../../scripts/bot/bot';
import randomId from '../../tools/randomId';
import { decrypt } from '../../tools/encryption';

export const prerender = false;
export const POST = async ({ request, cookies }) => {
	console.log('received POST request at api/order');
	const body = await request.json().then(res => res);
	const { content, userEmail, customMessage, colour, plasticType, layerHeight, infill } = body;

	const userId = decrypt(cookies.get('userId').value);

	const buffer = Buffer.from(content);

	const orderChannelId = '1164311557874921532';

	try {
		const channel = await client.channels.fetch(orderChannelId).then(res => res);
		if (channel) {
			const rid = randomId();

			const embed = new EmbedBuilder()
				.setTitle(`Order from ${userEmail.split('@')[0]}`)
				.addFields(
					{ name: 'Colour', value: colour, inline: true },
					{ name: 'Plastic Type', value: plasticType, inline: true },
					{ name: 'Layer Height', value: layerHeight, inline: true },
					{ name: 'Infill (%)', value: `${infill}%`, inline: true },
					{ name: 'Status', value: 'Order Sent', inline: true },
					{ name: 'Message', value: customMessage == '' ? 'None Given' : customMessage },
				)
				.setTimestamp()
				.setFooter({ text: `Contact at ${userEmail}` })
				.setColor([245, 63, 63]);

			const button = new ButtonBuilder().setCustomId('showModalButton').setLabel('Enter price').setStyle(ButtonStyle.Primary);

			const message = await channel.send({
				embeds: [embed],
				files: [{ attachment: buffer, name: "order.zip" }],
				components: [new ActionRowBuilder().addComponents(button)],
			});

			const _ = await Order.create({
				randomId: rid,
				userId,
				userEmail,
				customMessage,
				colour,
				plasticType,
				layerHeight,
				infill,
				fileName: "maxime you need to do the order name for szymon",
				fileLink: message.attachments.first().url,
			});
		}
	} catch (error) {
		console.log('An error occured: ' + error.message + '\n' + error);
	}

	return new Response(null, { status: 200 });
};
