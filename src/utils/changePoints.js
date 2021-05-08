const User = require("../user.js");
const mongoose = require("mongoose");
const addMe = require("./addMe");
mongoose.set("useFindAndModify", false);

module.exports = changePoints = async (_id, message, points) => {
  const strPoints = points;
  points = parseInt(points);
  if (
    strPoints.charAt(strPoints.length - 1) !== "%" &&
    (isNaN(points) || points < 1)
  ) {
    message.channel.send(
      `${message.author} nieprawidłowa liczba lub ilość mniejsza od 1`
    );
    return;
  }
  const num = Math.random() >= 0.52 ? 1 : -1;
  const filter = { _id: _id };
  let update = { $inc: { points: points * num } };
  try {
    before = await User.findOne(filter);
    if (!before) {
      await addMe(_id, message);
      return;
    }
    if (strPoints.charAt(strPoints.length - 1) === "%") {
      let x = parseInt((before.points * Number(strPoints.slice(0, -1))) / 100);
      if (isNaN(x) || x < 1) {
        return;
      }
      points = x;
      update = { $inc: { points: points * num } };
    }
    if (before.points < points) {
      message.channel.send(
        `${message.author} Nie posiadasz ${points} żołędzi, posiadasz tylko ${before.points}`
      );
      return;
    }
    const now = await User.findOneAndUpdate(filter, update, {
      new: true,
    });
    num === 1
      ? message.channel.send(
          `${message.author} Wygrał ${points} żołędzi, posiadasz teraz ${now.points}`
        )
      : message.channel.send(
          `${message.author} Przejebał ${points} żołędzi, posiadasz teraz ${now.points}`
        );
  } catch (error) {
    console.log(error);
    message.channel.send(`coś się popsuło`);
    return;
  }
};
