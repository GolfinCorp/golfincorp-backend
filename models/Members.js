const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
	firstName: { type: String, required: true },
	lastname: { type: String, required: true },
	membership: { type: Number, required: true },
	billingDate: { type: Date },
	status: { type: String, default: "active" },
	clubId: { type: String, required: true },
	// bills: [Object],
});

const Member = mongoose.model("Member", MemberSchema);

module.exports = Member;
