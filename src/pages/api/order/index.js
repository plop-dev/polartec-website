import Order from '../../../schemas/order';
import client from '../../../scripts/bot';

export const prerender = false;
export const POST = async ({ request }) => {
	const body = await request.json().then(res => res);
	const { fileData, fileName, mimeType, userEmail, customMessage } = body;
	const receivedFileBuffer = Buffer.from(fileData, 'base64');

	await Order.create({ userEmail, fileName, file: { data: receivedFileBuffer, contentType: mimeType } });

	const orderChannelId = '1164312818770788513'; // testing channel for now
	try {
		const channel = await client.channels.fetch(orderChannelId).then(res => res);
		if (channel) {
			await channel.send({
				content: `${userEmail} has ordered something!\nMessage: ${customMessage}`,
				files: [{ attachment: receivedFileBuffer, name: fileName }],
			});
		}
	} catch (error) {
		console.log('An error occured: ' + error.message + '\n' + error);
	}

	return new Response(null, { status: 200 });
};
