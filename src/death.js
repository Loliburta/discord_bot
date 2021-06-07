const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const twitchSchema = new Schema({
  game : { type : String, required: true },
  deaths: { type: Number, default: 0 },
});
const Death = mongoose.model("Deaths", twitchSchema);
module.exports = Death;
