const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  memberId: { type: String, required: true },
  clubId: { type: String, required: true },
  membership: { type: String, required: true },
  memberName: { type: String, required: true },
  date: { type: String, required: true },
  status: { type: String, default: "oncoming" },
  guests: [
    {
      name: { type: String, required: true },
      membership: { type: String },
      payment: { type: Number },
    },
  ],
});

const Game = mongoose.model("Game", GameSchema);

module.exports = Game;
