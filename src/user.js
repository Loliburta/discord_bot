const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  _id: { type: String, required: true },
  points: { type: Number, default: 0 },
  time : { type : Date, default: Date.now }
});
const User = mongoose.model("User", userSchema);
module.exports = User;
