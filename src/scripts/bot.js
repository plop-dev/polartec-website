import { Client, GatewayIntentBits } from 'discord.js';
const { BOT_TOKEN, CLIENT_ID, CLIENT_SECRET } = import.meta.env;

const client = new Client({
	intents: [GatewayIntentBits.Guilds],
});

client.login(BOT_TOKEN).then(() => {
	console.log(`${client.user.tag} is online!`);
});

export default client;
