const Member = require("../models/Members");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const getMembers = async (req, res) => {
	try {
		const members = await Member.find({ clubId: req.user.clubId });
		return res.status(200).send({ members });
	} catch (error) {
		console.log(error);
		return res.status(500).send({ error: error });
	}
};

const createMember = async (req, res) => {
	try {
		const { body, user } = req;
		const { firstName, lastname, membership, email } = body;
		if (!firstName || !lastname || !membership || !email) {
			return res.status(400).send({
				error: "Email, first name, lastname and membership are required",
			});
		}

		const clubId = user.clubId;
		const isMembershipTaken = await Member.findOne({ clubId, membership });
		const isUserTaken = await User.findOne({ email });

		if (isMembershipTaken) {
			return res
				.status(406)
				.send({ error: "The membership number is already taken" });
		}
		if (isUserTaken) {
			return res.status(406).send({ error: "This email is already in use" });
		}
		const memberResponse = await Member.create({
			firstName,
			lastname,
			membership,
			email,
			clubId,
		});

		const provitionalPassword = `${firstName.toLowerCase()}${membership}`;
		const hashedPassword = await bcrypt.hash(provitionalPassword, saltRounds);
		const newUser = await User.create({
			email,
			password: hashedPassword,
			role: "member",
			clubId: clubId,
			memberId: memberResponse._id,
		});

		return res.status(200).send({ user: newUser, member: memberResponse });
	} catch (error) {
		console.log(error);
		return res.status(500).send({ error: error.message });
	}
};

const updateMember = async (req, res) => {
	try {
		const { body, params, user } = req;
		const { firstName, lastname, membership } = body;
		const member = await Member.findOne({
			_id: params.id,
			clubId: user.clubId,
		});

		// Fields validation
		if (!firstName && !lastname && !membership) {
			return res.status(400).send({
				msg: "Either the firstname, lastname or membership are required to update",
			});
		}
		if (!member) {
			return res.status(404).send({
				error: "Member id does not match any existing member",
			});
		}

		const updatedMember = await Member.findByIdAndUpdate(member._id, body, {
			new: true,
		});

		return res
			.status(200)
			.send({ msg: "Member updated successfully", member: updatedMember });
	} catch (error) {
		console.log(error);
		return res.status(500).send({ error: error.message });
	}
};

const deleteMember = async (req, res) => {
	try {
		const { user, params } = req;
		const { id } = params;
		if (user.role !== "admin") {
			return res.status(401).send({ error: "Administrator rights required" });
		}

		const member = await Member.findOneAndDelete({ _id: id });
		if (!member) {
			return res
				.status(404)
				.send({ error: "Member id does not match any existing ID" });
		}
		return res.status(200).send({ msg: "Member deleted successfully", member });
	} catch (error) {
		console.log(error);
		return res.status(500).send({ error: error.message });
	}
};

module.exports = { createMember, updateMember, deleteMember, getMembers };
