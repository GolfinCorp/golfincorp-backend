// ? Encription Module https://github.com/kelektiv/node.bcrypt.js#readme
const bcrypt = require("bcrypt");

const User = require("../models/User");
const Club = require("../models/Club");
const { generateAccessToken } = require("../middlewares/auth");

const login = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(406).send({ error: "All fields are required" });
	}

	const user = await User.findOne({ email });
	if (!user) {
		return res.status(404).send({ error: "User not found" });
	}

	let token;
	if (bcrypt.compare(password, user.password)) {
		token = generateAccessToken({
			role: user.role,
			email: user.email,
			memberId: user.memberId || null,
			clubId: user.clubId,
		});
	} else {
		return res.status(406).send({ error: "Incorrect Password" });
	}
	return res.json({ token });
};

const getUserData = (req, res) => {
	return res.status(200).send({ msg: "Sos alto pro" });
};

module.exports = { login, getUserData };
