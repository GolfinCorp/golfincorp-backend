const Member = require("../models/Members");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const createMember = async (req, res) => {
	try {
		const { firstName, lastname, membership, email } = req.body;
		if (!firstName || !lastname || !membership || !email) {
			return res.status(400).send({
				error: "Email, first name, lastname and membership are required",
			});
		}
		const clubId = req.user.clubId;
		const clubMembers = await Member.find({ clubId });
		const memberInUse = clubMembers.some(
			(elm) => elm.membership === membership
		);

		const isUser = await User.findOne({ email });
		if (memberInUse) {
			return res
				.status(406)
				.send({ error: "The membership number is already taken" });
		}
		if (isUser) {
			return res.status(400).send({ error: "This email already in use" });
		}
		const memberResponse = await Member.create({
			firstName,
			lastname,
			membership,
			email,
			clubId,
		});

		const provitionalPassword = `${firstName}${membership}`;
		const hashedPassword = await bcrypt.hash(provitionalPassword, saltRounds);
		const user = await User.create({
			email,
			password: hashedPassword,
			role: "member",
			clubId: clubId,
			memberId: memberResponse._id,
		});

		return res.status(200).send({ user, member: memberResponse });
	} catch (err) {
		console.log(err);
	}
};

module.exports = { createMember };
