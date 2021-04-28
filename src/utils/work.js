const User = require("../user.js");
module.exports = work = async (_id, message) => {
  const filter = { _id: _id };
  try {
    usr = await User.findOne(filter);
    if (usr) {
      const diff = new Date() - usr.time;
      const hour = 3600000;
      if (diff > hour) {
        earnedPoints = Math.floor(Math.random() * 250) + 100;
        const update = { $inc: { points: earnedPoints }, time: new Date() };
        const now = await User.findOneAndUpdate(filter, update, {
          new: true,
        });
        message.channel.send(
          `${message.author} na swojej ciężkiej pracy zarobiłeś ${earnedPoints} żołędzi posiadasz teraz ${now.points}`
        );
      } else if (diff > 60e3) {
        message.channel.send(
          `${message.author} będziesz mógł znowu pracować za ${Math.ceil(
            60 - diff / 60e3
          )} minut`
        );
      } else {
        message.channel.send(
          `${message.author} będziesz mógł znowu pracować za 60 minut`
        );
      }
    } else {
      message.channel.send(
        `${message.author} nie jesteś w gangu gamblerów, użyj !addMe aby dołączyć`
      );
    }
  } catch (err) {
    console.log(err);
  }
  return;
};
