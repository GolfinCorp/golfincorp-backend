// ? Encription Module https://github.com/kelektiv/node.bcrypt.js#readme
const bcrypt = require("bcrypt");

const User = require("../models/User");
const { generateAccessToken } = require("../middlewares/auth");

const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).send({ error: "All fields are required" });
		}

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).send({ error: "User not found" });
		}

		const passwordMatch = await bcrypt.compare(password, user.password);
		if (passwordMatch) {
			const token = generateAccessToken({
				role: user.role,
				email: user.email,
				memberId: user.memberId || null,
				clubId: user.clubId,
			});
			return res.json({ token });
		}
		return res.status(406).send({ error: "Incorrect Password" });
	} catch (error) {
		console.log(error);
		return res.status(500).send({ error: error.message });
	}
};

module.exports = { login };
