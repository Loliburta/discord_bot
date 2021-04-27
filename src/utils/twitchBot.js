
const tmi = require('tmi.js');
require("dotenv").config();

const clientId = process.env.TWITCH_CLIENT_ID
const oauthToken = process.env.TWITCH_OAUTH_TOKEN
const redirectUri= "http://localhost"
let link = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=chat:edit+chat:read`
// chat:read
// chat:edit
console.log(oauthToken)
const client = new tmi.Client({
	options: { debug: true },
	identity: {
		username: 'BankLesny',
		password: `oauth:${oauthToken}`
	},
	channels: [ 'Loliburta' ]
});

client.connect();

client.on('message', (channel, tags, message, self) => {
	// Ignore echoed messages.
	if(self) return;

	if(message.toLowerCase() === '!hello') {
		// "@alca, heya!"
		client.say(channel, `@${tags.username}, heya!`);
	}
});
