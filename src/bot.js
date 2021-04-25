require("dotenv").config();
const mongoose = require("mongoose");
const { Client } = require("discord.js");
const User = require("./user.js");
const saveUser = require("./utils/saveUser");

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
  if (message.content === "hello") {
    message.channel.send("hey");
  }
  if (message.content.startsWith(prefix)) {
    const [commandName, ...args] = message.content
      .trim()
      .substring(prefix.length)
      .split(/\s+/);
    console.log(commandName, args);
    if (
      commandName === "gamble" &&
      !isNaN(parseInt(args[0])) &&
      parseInt(args[0]) > 0
    ) {
      if (Math.random() >= 0.5) {
        message.channel.send(
          `${message.author} Wygrał ${parseInt(args[0]) * 2} żołędzi`
        );
      } else {
        message.channel.send(
          `${message.author} Przejebał ${parseInt(args[0])} żołędzi`
        );
      }
    }
    if (commandName === "addMe") {
      User.countDocuments({ _id: message.author.id }, function (err, count) {
        console.log("abc");
        console.log(count);
        if (count > 0) {
          message.channel.send(
            `${message.author} jesteś już w gangu gamblerów`
          );
        } else {
          saveUser(message.author.id, message);
        }
      });
    }
  }
});

connectToDb();
