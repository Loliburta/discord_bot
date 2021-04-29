require("dotenv").config();
const mongoose = require("mongoose");
const tmi = require("tmi.js");
const { Client } = require("discord.js");
const changePoints = require("./utils/changePoints");
const addMe = require("./utils/addMe");
const checkPoints = require("./utils/checkPoints");
const withdraw = require("./utils/withdraw");
const work = require("./utils/work");

const clientId = process.env.TWITCH_CLIENT_ID;
const oauthToken = process.env.TWITCH_OAUTH_TOKEN;
const channel = process.env.TWITCH_CHANNEL;

const dbLogin = process.env.DATABASE_LOGIN;
const dbPassword = process.env.DATABASE_PASSWORD;

// let link = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=http://localhost&response_type=token&scope=chat:edit+chat:read`;

const connect = async () => {
  const dbURI = `mongodb+srv://${dbLogin}:${dbPassword}@users.f3nwf.mongodb.net/Users?retryWrites=true&w=majority`;
  try {
    console.log("connecting to db");
    const result = await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connected to db");
    console.log("connecting to twitch");
    await twitchClient.connect();
    console.log("connected to twitch");
    console.log("logging to discord");
    await client.login(process.env.DISCORDJS_BOT_TOKEN);
  } catch (error) {
    console.log(error);
  }
};

// Discord
const client = new Client();
const prefix = "!";

client.on("ready", () => {
  console.log(`${client.user.username} has logged in`);
});
client.on("message", (message) => {
  // Ignore echoed messages.
  if (message.author.bot) {
    return;
  }
  const now = new Date()
  console.log(now, message.author.username, message.content)
  if (message.content === "e śpisz?") {
    message.channel.send("nie śpie, streama mam");
  }
  if (message.content.startsWith(prefix)) {
    const [commandName, ...args] = message.content
      .trim()
      .substring(prefix.length)
      .split(/\s+/);
    console.log(commandName, args);

    //available commands
    if (commandName === "gamble") {
      changePoints(message.author.id, message, args[0]);
    } else if (commandName === "zoledzie" || commandName === "żołędzie") {
      checkPoints(message.author.id, message);
    } else if (commandName === "addMe") {
      addMe(message.author.id, message);
    } else if (commandName === "wyplata" || commandName === "wypłata") {
      withdraw(message.author.id, message, args, twitchClient);
    } else if (commandName === "pracuj") {
      work(message.author.id, message);
    }
  }
});

//Twitch
const twitchClient = new tmi.Client({
  options: { debug: true },
  identity: {
    username: "bank_lesny",
    password: `oauth:${oauthToken}`,
  },
  channels: [channel],
});

twitchClient.on("message", (channel, tags, message, self) => {
  // Ignore echoed messages.
  console.log(message);
  if (self) return;

  if (message.toLowerCase() === "!e_śpisz?") {
    twitchClient.say("#szysszxka", `@${tags.username} nie, streama mam`);
  }
});

connect();
