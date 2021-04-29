const User = require("../user.js");
module.exports = ranking = async (_id, message) => {
  let ranking = "";
  try {
    User.find({})
      .sort([["points", -1]])
      .exec(async function (err, docs) {
        docs = docs.slice(0, 5);
        let count = 1;
        for (const usr of docs) {
          let username = await message.guild.members.fetch(usr._id);
          let points = usr.points;
          ranking += `${count} ${username} ${points} żołędzi\n`;
          count += 1;
        }
        message.channel.send(ranking);
      });
  } catch (err) {
    console.log(err);
  }
  return;
};
