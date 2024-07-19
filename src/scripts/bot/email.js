import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import client from './bot';
import url from 'url';
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
		for await (let message of Imapclient.fetch('1:5', { envelope: true })) {
			const gmailLink = `https://mail.google.com/mail/u/0/#inbox`;

			emailList.push({
				uid: message.uid,
				subject: message.envelope.subject,
				from: message.envelope.from[0].name || message.envelope.from[0].address,
				date: message.envelope.date,
				size: message.size,
				link: gmailLink,
			});
		}

		const emailChannelId = '1164312818770788513'; // testing channel for now
		try {
			const channel = await client.channels.fetch(emailChannelId).then(res => res);
			if (channel) {
				if (emailList.length >= 0) {
					await channel.send({ content: `First 5 unread emails:` });
					emailList.forEach(async email => {
						const embed = new EmbedBuilder()
							.setColor([60, 40, 230])
							.setTimestamp()
							.setTitle(`${email.from}: ${email.subject}`)
							.setDescription(`UID: ${email.uid}\nDate Sent: ${email.date}`);

						const readButton = new ButtonBuilder().setCustomId(`read-${email.uid}`).setLabel('Mark as read').setStyle(ButtonStyle.Primary);
						const deleteButton = new ButtonBuilder().setCustomId(`delete-${email.uid}`).setLabel('Delete').setStyle(ButtonStyle.Danger);
						const linkButton = new ButtonBuilder().setLabel('Open inbox in browser').setStyle(ButtonStyle.Link).setURL(email.link);

						const row = new ActionRowBuilder().addComponents(readButton, deleteButton, linkButton);

						await channel.send({ embeds: [embed], components: [row] });
					});
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

// schedule.scheduleJob('10 * * * * *', () => {
// 	main();
// });

client.on('interactionCreate', async interaction => {
	if (interaction.isButton()) {
		const emailUID = interaction.customId.split('-')[1];
		const customId = interaction.customId.split('-')[0];
		if (customId === 'read') {
			try {
				await Imapclient.messageFlagsAdd('1:*', ['Seen'], { uid: emailUID });
				await interaction.reply({ content: `Email successfully marked as read.`, ephemeral: true });
			} catch (error) {
				console.log('An error occured: ' + error.message + '\n' + error);
				await interaction.reply({ content: `An error occured. Contact \`plop_dev\` for assistance or try again later.`, ephemeral: true });
			}
		} else if (customId === 'delete') {
			try {
				await Imapclient.messageDelete('1:*', { uid: emailUID });
				await interaction.reply({ content: `Email successfully deleted.`, ephemeral: true });
			} catch (error) {
				console.log('An error occured: ' + error.message + '\n' + error);
				await interaction.reply({ content: `An error occured. Contact \`plop_dev\` for assistance or try again later.`, ephemeral: true });
			}
		}
	}
});
