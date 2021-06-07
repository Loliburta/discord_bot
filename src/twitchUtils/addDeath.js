const Death = require("../death");
module.exports = addDeath = async (deathsCounterGame, twitchClient, channel) => {
  const update = { $inc: { deaths: 1 } };
  const filter = { game: deathsCounterGame };
  const countRows = await Death.countDocuments(filter);
  if (!countRows) {
    const death = new Death({
      game: deathsCounterGame,
    });
    await death.save();
  }
  const now = await Death.findOneAndUpdate(filter, update, {
    new: true,
  });
  twitchClient.say(
    channel,
    `Dodano zgon, Szycha umarła ${now.deaths} razy w grze ${deathsCounterGame}`
  );
};
