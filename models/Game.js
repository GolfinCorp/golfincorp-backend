const mongoose = require("mongoose");

/**
 * @methods
 * ? this.canStart:  This method should return a boolean if there is any player who hasn't paid
 * ? this.forceStar: forces a game to start by deleting all debtful guests and sets the status to start
 */

const GameSchema = new mongoose.Schema(
	{
		memberId: { type: String, required: true },
		clubId: { type: String, required: true },
		membership: { type: String, required: true },
		memberName: { type: String, required: true },
		date: { type: Date, required: true },
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
		// ! Here we can declare methods for recurrent small functions
		methods: {
			canStart() {
				let unpayedGuest = this.guests.filter(
					(guest) => !guest.paymentId && !guest.membership
				);
				return unpayedGuest;
			},
			forceStart() {
				let members = this.guests.filter((guest) => guest.membership);
				let payedGuests = this.guests.filter((guest) => guest.paymentId);
				this.guests = [...members, ...payedGuests];
				this.status = "start";
				this.save();
				return this;
			},
			addGuest() {},
		},
	}
);

const Game = mongoose.model("Game", GameSchema);

module.exports = Game;
