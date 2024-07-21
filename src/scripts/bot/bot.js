import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();
const { BOT_TOKEN, CLIENT_ID, CLIENT_SECRET, EMAIL_APP_PASSWORD } = process.env;

const client = new Client({
	intents: [GatewayIntentBits.Guilds],
});

client.login(BOT_TOKEN).then(() => {
	console.log(`${client.user.tag} is online! @Website`);
});

export default client;
