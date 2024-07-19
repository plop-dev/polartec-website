import client from './bot';
import { ImapFlow } from 'imapflow';
import * as schedule from 'node-schedule';
const { EMAIL_APP_PASSWORD } = import.meta.env;

const Imapclient = new ImapFlow({
	host: 'imap.gmail.com',
	port: 993,
	secure: true,
	auth: {
		user: 'Contact.PolarTec@gmail.com',
		pass: `${EMAIL_APP_PASSWORD}`, // Replace with your Gmail app password
	},
	tls: {
		rejectUnauthorized: false, // Ignore self-signed certificates
	},
	emitLogs: false,
	logger: false,
});

const main = async () => {
	await Imapclient.connect(); // Connect to the Gmail IMAP server.

	let lock = await Imapclient.getMailboxLock('INBOX'); // Lock and select the 'INBOX' mailbox.
	try {
		const emailList = [];
		for await (let message of Imapclient.fetch('1:*', { envelope: true })) {
			emailList.push({
				uid: message.uid,
				subject: message.envelope.subject,
				from: message.envelope.from[0].name || message.envelope.from[0].address,
				date: message.envelope.date,
			});
		}

		// Log the email information in a clean format
		let message = '---\n';
		emailList.forEach(email => {
			message += `UID: ${email.uid}\n`;
			message += `Subject: ${email.subject}\n`;
			message += `From: ${email.from}\n`;
			message += `Date: ${email.date}\n`;
			message += '---\n';
		});

		const emailChannelId = '1166426519845994607'; // testing channel for now
		try {
			const channel = await client.channels.fetch(emailChannelId).then(res => res);
			if (channel) {
				if (message !== '---\n') {
					await channel.send({ content: `Unread email(s):\n\`\`\`\n${message}\`\`\`` });
				}
			}
		} catch (error) {
			console.log('An error occured: ' + error.message + '\n' + error);
		}
	} finally {
		lock.release(); // Release the mailbox lock.
	}

	await Imapclient.logout(); // Log out and close the connection.
};

schedule.scheduleJob('15 * * * *', () => {
	main();
});
