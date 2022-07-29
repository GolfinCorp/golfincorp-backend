const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema(
  {
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
        bill: { type: Number },
        paymentId: { type: Number },
      },
    ],
  },
  {
    methods: {
      canStart() {
        let unpayedGuest = this.guests.filter(
          (guest) => !guest.paymentId && !guest.membership
        );
        return unpayedGuest;
      },
    },
  }
);

const Game = mongoose.model("Game", GameSchema);

module.exports = Game;
