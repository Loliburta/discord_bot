const User = require("../user.js");
module.exports = saveUser = async (_id, message, args) => {
  const points = parseInt(args[0]);
  const guess = parseInt(args[1]);
  if (isNaN(points) || isNaN(guess)) {
    message.channel.send(
      `${message.author} poprawny zapis ruletki to !ruletka [ilość] [numer] numer: 0-10 np !ruletka 1000 8`
    );
    return;
  }
  if (points < 10) {
    message.channel.send(
      `${message.author} minimalna wartość zakładu to 10 żołędzi`
    );
    return;
  }
  if (guess < 0 || guess > 10) {
    message.channel.send(
      `${message.author} poprawny zapis to !ruletka [ilość] [numer] numer od 0 do 10`
    );
    return;
  }

  const filter = { _id: _id };
  let update = { $inc: { points: points * 10 } };
  try {
    before = await User.findOne(filter);
    if (!before) {
      await addMe(_id, message);
      return;
    }
    if (points > before.points) {
      message.channel.send(
        `${message.author}, nie posiadasz ${points} żołędzi masz tylko ${before.points}`
      );
      return;
    }
    const winningGuess = Math.floor(Math.random() * 11);
    if (guess === winningGuess) {
      const now = await User.findOneAndUpdate(filter, update, {
        new: true,
      });
      message.channel.send(
        `${message.author} udało ci się trafić numer! zarobiłeś ${
          points * 10
        }, posiadasz teraz ${now.points}`
      );
    } else {
      update = { $inc: { points: -points } };
      const now = await User.findOneAndUpdate(filter, update, {
        new: true,
      });
      message.channel.send(
        `${message.author} nie udało ci się trafić, wypadło na numer ${winningGuess}, posiadasz teraz ${now.points}`
      );
    }
  } catch (error) {
    console.log(error);
    message.channel.send(`${message.author} coś się popsuło`);
  }
  return;
};
