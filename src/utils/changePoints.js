const User = require("../user.js");
const mongoose = require("mongoose");
const addMe = require("./addMe");
mongoose.set("useFindAndModify", false);

module.exports = changePoints = async (_id, message, points) => {
  let strPoints = points;
  points = parseInt(points);

  console.log(strPoints);
  console.log(points);
  console.log(strPoints.charAt(strPoints.length - 1));

  if (isNaN(points) || points < 1) {
    return;
  }

  let num = Math.random() >= 0.5 ? 1 : -1;
  const filter = { _id: _id };
  let update = { $inc: { points: points * num } };
  try {
    before = await User.findOne(filter);
    if (!before) {
      await addMe(_id, message);
      return;
    }
    if (strPoints.charAt(strPoints.length - 1) === "%") {
      points = parseInt((before.points * Number(strPoints.slice(0, -1))) / 100);
      update = { $inc: { points: points * num } };
    }
    if (before.points < points) {
      message.channel.send(
        `${message.author} Nie posiadasz ${points} żołędzi, masz tylko ${before.points}`
      );
      return;
    }
    let now = await User.findOneAndUpdate(filter, update, {
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
