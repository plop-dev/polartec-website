import client from './bot';
import { REST, Routes, ApplicationCommandOptionType } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();
const { BOT_TOKEN, CLIENT_ID, CLIENT_SECRET, EMAIL_APP_PASSWORD, POLARTEC_DISCORD_SERVER } = process.env;

const commands = [
	{
		name: 'status',
		description: 'Control the status of an order. Make sure to do this regularly.',
		options: [
			{
				name: 'id',
				description: 'The id of the order (look for the Custom ID field in the New Order embed.',
				type: ApplicationCommandOptionType.String,
				required: true,
			},
			{
				name: 'status',
				description: 'The status of the order.',
				type: ApplicationCommandOptionType.String,
				choices: [
					{
						name: 'Printing',
						value: 'printing',
					},
					{
						name: 'Printed',
						value: 'printed',
					},
					{
						name: 'Delivered',
						value: 'delivered',
					},
				],
				required: true,
			},
		],
	},
];

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

const registerCommands = async () => {
	try {
		console.log('🔁 Registering status control command...');

		await rest.put(Routes.applicationGuildCommands(CLIENT_ID, POLARTEC_DISCORD_SERVER), { body: commands });
		console.log('✅ Successfully registered status control command.');
	} catch (error) {
		console.log('An error occured: ' + error.message + '\n' + error);
	}
};

export default registerCommands;
