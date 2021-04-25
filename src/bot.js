require("dotenv").config();

const { Client } = require("discord.js");

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
  if (message.content === "hello") {
    message.channel.send("hey");
  }
  if (message.content.startsWith(prefix)) {
    const [commandName, ...args] = message.content
      .trim()
      .substring(prefix.length)
      .split(/\s+/);
    console.log(commandName, args);
    if (commandName === "gamble" && !isNaN(parseInt(args[0])) && parseInt(args[0]) > 0) {
      console.log(parseInt(args[0]))
      Math.random() >= 0.5
        ? message.channel.send(
            `${message.author} Wygrał ${parseInt(args[0]) * 2} żołędzi`
          )
        : message.channel.send(
            `${message.author} Przejebał ${parseInt(args[0])} żołędzi`
          );
    }
  }
});

client.login(process.env.DISCORDJS_BOT_TOKEN);
