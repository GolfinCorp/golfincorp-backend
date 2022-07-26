const mongoose = require("mongoose");

const ClubSchema = new mongoose.Schema({
	email: { type: String, required: true },
	name: { type: String, required: true, maxLenght: 50 },
	state: { type: String, required: true, maxLength: 60 },
	country: { type: String, required: true, maxLength: 50 },
	subscription: {
		startDate: { type: Date },
		billingDate: { type: Date },
		bills: [Object],
		plan: { type: String },
		price: { type: Number },
	},
});

const Club = mongoose.model("Club", ClubSchema);

module.exports = Club;
