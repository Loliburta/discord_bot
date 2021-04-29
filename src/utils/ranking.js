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
          const obj = await message.guild.members.fetch(usr._id);
          const username = obj.user.username;
          const points = usr.points;
          ranking += `${count} ${username[0]}${username.slice(
            1,
            username.length
          )} ${points} żołędzi\n`;
          count += 1;
        }
        message.channel.send(ranking);
      });
  } catch (err) {
    console.log(err);
  }
  return;
};
