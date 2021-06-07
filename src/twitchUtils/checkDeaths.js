const Death = require("../death");
module.exports = checkDeaths = async (
  deathsCounterGame,
  twitchClient,
  channel
) => {
  const filter = { game: deathsCounterGame };
  try {
    death = await Death.findOne(filter);
    twitchClient.say(
      channel,
      `Szycha umarła ${death.deaths} w grze ${deathsCounterGame}`
    );
  } catch (err) {
    console.log(err);
  }
};
