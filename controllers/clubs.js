const Club = require("../models/Club");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const createClub = async (req, res) => {
	try {
		const { email, name, state, country, subscription, maxParty, guestPrice } =
			req.body;

		if ((!email, !name, !state, !country, !subscription)) {
			return res.status(400).send({ error: "All fields are required" });
		}

		const provitionalPassword = name.replaceAll(" ", "_").toLowerCase();
		const hashedPassword = await bcrypt.hash(provitionalPassword, saltRounds);
		const clubResponse = await Club.create({
			email,
			name,
			state,
			country,
			maxParty,
			guestPrice,
			subscription: {
				start_date: new Date(),
				plan: subscription.plan,
				price: subscription.price,
			},
		});
		let superUser = await User.create({
			email,
			password: hashedPassword,
			role: "admin",
			clubId: clubResponse._id,
		});

		return res.status(200).send({
			data: {
				club: clubResponse,
				admin: {
					email: superUser.email,
					role: superUser.role,
					password: provitionalPassword,
				},
			},
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send({ error: error.message });
	}
};

const getClub = async (req, res) => {
	try {
		const { user } = req;
		const club = await Club.findById(user.clubId);
		return res.status(200).send(club);
	} catch (error) {
		console.log(error);
		return res.status(500).send({ error: error.message });
	}
};

const updateClub = async (req, res) => {
	try {
		const { body, user } = req;
		const club = await Club.findOne({ _id: user.clubId });
		const updatedClub = await Club.findByIdAndUpdate(club._id, body, {
			new: true,
		});
		return res.status(200).send({ club: updatedClub });
	} catch (error) {
		console.log(error);
		return res.status(500).send({ error: error.message });
	}
};

module.exports = { createClub, updateClub, getClub };
