require("dotenv").config();
const mongoose = require("mongoose");
const tmi = require("tmi.js");
const { Client } = require("discord.js");
const changePoints = require("./utils/changePoints");
const addMe = require("./utils/addMe");
const checkPoints = require("./utils/checkPoints");
const withdraw = require("./utils/withdraw");
const work = require("./utils/work");
const ranking = require("./utils/ranking");
const roulette = require("./utils/roulette");
const Death = require("./death");

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
  const now = new Date();
  console.log(now, message.author.username, message.content);
  if (message.content.startsWith(prefix)) {
    const [commandName, ...args] = message.content
      .trim()
      .substring(prefix.length)
      .split(/\s+/);
    console.log(commandName, args);

    //available commands
    switch (commandName) {
      case "gamble":
        changePoints(message.author.id, message, args[0]);
        break;
      case "zoledzie":
        checkPoints(message.author.id, message);
        break;
      case "żołędzie":
        checkPoints(message.author.id, message);
        break;
      case "addMe":
        addMe(message.author.id, message);
        break;
      case "wyplata":
        withdraw(message.author.id, message, args, twitchClient);
        break;
      case "wypłata":
        withdraw(message.author.id, message, args, twitchClient);
        break;
      case "pracuj":
        work(message.author.id, message);
        break;
      case "ranking":
        ranking(message.author.id, message);
        break;
      case "ruletka":
        roulette(message.author.id, message, args);
        break;
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
let deathsCounterGame = "-";
twitchClient.on("message", (channel, tags, message, self) => {
  // Ignore echoed messages.
  message = message.toLowerCase().trim();
  if (self) return;
  if (
    ["!e_śpisz?", "!e_śpysz?", "e śpysz?", "e śpisz?"].includes(
      message.toLowerCase()
    )
  ) {
    twitchClient.say(channel, `@${tags.username} nie, streama mam`);
  }
  if (
    tags.badges.moderator === "1" &&
    message.split(" ").includes("!ustawzgony")
  ) {
    if (message.split(" ").length > 1) {
      deathsCounterGame = message.split(" ").slice(1).join(" ");
      twitchClient.say(
        channel,
        `Ustawiono licznik śmierci dla gry ${deathsCounterGame}`
      );
    }
  }
  if (message === "!zgon") {
    const addDeath = async () => {
      const update = { $inc: { deaths: 1 } };
      const filter = { game: deathsCounterGame };
      const countRows = await Death.countDocuments(filter);
      if (!countRows) {
        const death = new Death({
          game: deathsCounterGame,
        });
        await death.save();
      }
      const now = await Death.findOneAndUpdate(filter, update, {
        new: true,
      });
      twitchClient.say(
        channel,
        `Szyszka umarła ${now.deaths} w grze ${deathsCounterGame}`
      );
    };
    addDeath();
  }
});

connect();
