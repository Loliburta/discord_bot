const User = require("../user.js");
const BannedWords = require("./bannedWords");
const channel = process.env.TWITCH_CHANNEL;

module.exports = withdraw = async (_id, message, args, twitchClient) => {
  if (!args[0] || isNaN(args[0]) || !args[1]) {
    message.channel.send(
      `${message.author}, poprawny zapis to !wyplata [ilość] [nick na twitchu] np !wyplata 1000 Loliburta`
    );
    return;
  }
  if (BannedWords.bannedWords.has(args[1])) {
    message.channel.send(
      `${message.author} wysłał bannable słowo <@307545630027284500>`
    );
    return;
  }
  const withdrawPoints = parseInt(args[0]);
  const filter = { _id: _id };
  const update = { $inc: { points: -withdrawPoints } };
  if (withdrawPoints < 300) {
    message.channel.send(`${message.author} minimalna kwota wypłaty to 300`);
    return;
  }
  try {
    usr = await User.findOne(filter);
    if (usr) {
      if (usr.points > withdrawPoints) {
        const now = await User.findOneAndUpdate(filter, update, {
          new: true,
        });
        twitchClient.say(channel, `!addpoints ${args[1]} ${withdrawPoints}`);
        message.channel.send(
          `${message.author} wypłaciłeś ${withdrawPoints} żołędzi, posiadasz teraz ${now.points}`
        );
      } else {
        message.channel.send(
          `${message.author} nie masz ${withdrawPoints} żołedzi, posiadasz tylko ${usr.points}`
        );
      }
    } else {
      message.channel.send(
        `${message.author} nie jesteś w gangu gamblerów użyj !addMe żeby się dodać`
      );
    }
  } catch (err) {
    console.log(err);
  }
  return;
};
