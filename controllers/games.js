const Game = require("../models/Game");
const Member = require("../models/Members");

const createGame = async (req, res) => {
	try {
		const { body, user } = req;
		const { date, guests } = body;
		if (user.role === "admin") {
			return res
				.status(406)
				.send({ error: "Can't create a game with an admin account" });
		}
		if (!date) {
			return res.status(400).send({ error: "The date field is needed" });
		}
		const formatDate = new Date(date);
		const member = await Member.findOne({ _id: user.memberId });

		const game = await Game.create({
			clubId: user.clubId,
			memberId: member._id,
			membership: member.membership,
			memberName: member.firstName,
			date: formatDate,
			guests,
		});

		return res.status(200).send(game);
	} catch (error) {
		console.log(error);
		return res.status(500).send({ error: error.message });
	}
};

// ? If member gets all his game, else get all the club games
const getGames = async (req, res) => {
	try {
		const { user } = req;
		const isMember = Boolean(user.memberId);
		const games = await Game.find(
			isMember ? { memberId: user.memberId } : { clubId: user.clubId }
		);
		return res.status(200).send(games);
	} catch (error) {
		console.log(error);
		return res.status(500).send({ error: error.message });
	}
};

const manageGame = async (req, res) => {
	try {
		const { params, body, user } = req;
		let { status } = body;

		if (user.role === "member") {
			status = "cancelled";
		}

		if (!status) {
			return res.status(400).send({ error: "Game status and id are required" });
		}

		const gameExists = await Game.findOne({ _id: params.id });
		if (!gameExists) {
			return res
				.status(404)
				.send({ error: "Game id does not match any existing game" });
		}

		const game = await Game.findByIdAndUpdate(
			params.id,
			{ status },
			{ new: true }
		);
		return res.status(200).send(game);
	} catch (error) {
		console.log(error);
		return res.status(500).send({ error: error.message });
	}
};

const addGuests = async (req, res) => {
	try {
		const { body, params } = req;
		const gameExists = await Game.findOne({ _id: params.id });
		if (!gameExists) {
			return res
				.status(404)
				.send({ error: "Game id doesn't match any existing game" });
		}
		if (!body.guests) {
			return res.status(400).send({ error: "At least 1 guest is required" });
		}
		if (!Array.isArray(body.guests) || !body.guests.length) {
			return res
				.status(400)
				.send({ error: "Guests must not be an empty array" });
		}
		return res.status(200).send({ msg: "Success" });
	} catch (error) {
		console.log(error);
		return res.status(500).send({ error: error.message });
	}
};

const deleteGame = async (req, res) => {
	try {
		const { params } = req;
		const gameExist = await Game.findOne({ _id: params.id });
		if (!gameExist) {
			return res
				.status(404)
				.send({ error: "Game id provided does not match any existing game" });
		}

		const deleteResponse = await Game.deleteOne({ _id: params.id });
		return res
			.status(200)
			.send({ msg: "Game deleted succesfully", deleteResponse });
	} catch (error) {
		console.log(error);
		return res.status(500).send({ error: error.message });
	}
};

module.exports = { createGame, getGames, manageGame, deleteGame, addGuests };
