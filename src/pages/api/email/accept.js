import client from '../../../scripts/bot/bot';
import Order from '../../../schemas/order';

export const prerender = false;
export async function GET({ request, cookies, redirect }) {
	const orderChannelId = '1164312818770788513'; // testing channel for now
	try {
		const randomId = request.url.split('?')[1].split('=')[1];
		const res = await Order.findOneAndUpdate({ randomId }, { $set: { status: 'Preparing' } });

		const channel = await client.channels.fetch(orderChannelId).then(res => res);
		if (channel) {
			const messages = await channel.messages.fetch();
			const id = messages.find(msg => {
				return msg.embeds[0].data.fields.find(field => field.name === 'Custom ID').value === randomId;
			}).id;
			await channel.messages.cache.get(id).edit({ content: `\`\`\`md\nUser has the accepted order. **PRINTING CAN START!**\n\`\`\`` });
		}

		return redirect('/dashboard/orders', 302);
	} catch (error) {
		console.log('An error occured: ' + error.message + '\n' + error);
		return redirect('/dashboard/orders', 302);
	}
}
