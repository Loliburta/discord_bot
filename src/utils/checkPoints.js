const User = require("../user.js");
const mongoose = require("mongoose");
module.exports = checkPoints = async (_id, message) => {
  const filter = { _id: _id };
  try {
    usr = await User.findOne(filter);
    message.channel.send(`${message.author} posiadasz ${usr.points} żołędzie`);
  } catch (err) {
    console.log(err);
  }
  return;
};
