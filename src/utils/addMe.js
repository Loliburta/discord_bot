const User = require("../user.js");
const saveUser = require("./saveUser");

module.exports = addMe = async (_id, message) => {
  const count = await User.countDocuments({ _id: _id });
  count
    ? message.channel.send(`${message.author} jesteś już w gangu gamblerów`)
    : saveUser(_id, message);
};
