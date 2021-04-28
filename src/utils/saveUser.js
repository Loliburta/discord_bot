const User = require("../user.js");
module.exports = saveUser = async (_id, message) => {
  try {
    const user = new User({
      _id: _id,
      points: 2000,
    });
    await user.save();
    message.channel.send(`${message.author} został dodany do gangu gamblerów`);
  } catch (error) {
    console.log(error);
    message.channel.send(
      `${message.author} nie zostałeś dodany bo coś się popsuło`
    );
  }
};
