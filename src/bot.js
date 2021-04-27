require("dotenv").config();
const mongoose = require("mongoose");
const { Client } = require("discord.js");
const User = require("./user.js");
const changePoints = require("./utils/changePoints");
const addMe = require("./utils/addMe");
const checkPoints = require("./utils/checkPoints");

const connectToDb = async () => {
  const dbLogin = process.env.DATABASE_LOGIN;
  const dbPassword = process.env.DATABASE_PASSWORD;
  const dbURI = `mongodb+srv://${dbLogin}:${dbPassword}@user.f3nwf.mongodb.net/User?retryWrites=true&w=majority`;
  try {
    console.log("connecting to db");
    const result = await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connected to db");
    client.login(process.env.DISCORDJS_BOT_TOKEN);
  } catch (error) {
    console.log(error);
  }
};

const client = new Client();
const prefix = "!";

client.on("ready", () => {
  console.log(`${client.user.username} has logged in`);
});
client.on("message", (message) => {
  if (message.author.bot) {
    return;
  }
  console.log(`[${message.author.tag}] ${message}`);
  console.log(message.author.id);
  if (message.content === "e śpisz?") {
    message.channel.send("nie");
  }
  if (
    message.content === "!gamble 1" &&
    message.author.tag === "szyszka#9642"
  ) {
    message.channel.send("przestań gamblować po 1 żołędziu Szycha");
  }
  if (message.content === "czy kox to kox?") {
    message.channel.send("nie wiem");
  }
  if (message.content === "Co na grzale?") {
    message.channel.send("chujnia, ananas i gruszka");
  }
  if (message.content === "Czy szyszka to rura?") {
    message.channel.send("nie, no może troszkę");
  }
  if (message.content === "Czy rura to ruda?") {
    message.channel.send("przestańcie mi zdawać głupie pytania");
  }
  if (message.content === "Czemu kierowca to stuleja?") {
    message.channel.send("taki się urodził");
  }
  if (message.content === "Czy ruda uprawiała masturbacje z koleżanką ?") {
    message.channel.send("... tak");
  }
  if (message.content.startsWith(prefix)) {
    const [commandName, ...args] = message.content
      .trim()
      .substring(prefix.length)
      .split(/\s+/);
    console.log(commandName, args);
    if (commandName === "gamble") {
      changePoints(message.author.id, message, args[0]);
    }
    if (commandName === "zoledzie") {
      checkPoints(message.author.id, message);
    }
    if (commandName === "addMe") {
      addMe(message.author.id, message);
    }
  }
});

connectToDb();
