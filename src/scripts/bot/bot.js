import { Client, GatewayIntentBits } from 'discord.js';
// const { BOT_TOKEN, CLIENT_ID, CLIENT_SECRET } = import.meta.env;
import dotenv from 'dotenv';
dotenv.config();
const { BOT_TOKEN, CLIENT_ID, CLIENT_SECRET } = process.env;

const client = new Client({
	intents: [GatewayIntentBits.Guilds],
});

client.login(BOT_TOKEN).then(() => {
	console.log(`${client.user.tag} is online!`);
});

export default client;
