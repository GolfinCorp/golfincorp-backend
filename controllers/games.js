const Club = require("../models/Club");
const Game = require("../models/Game");
const Member = require("../models/Members");
const { addDays } = require("../utils/sumDates");

const createGame = async (req, res) => {
	try {
		const { body, user } = req;
		const { date, guests } = body;

		// Validate body
		if (!date) {
			return res.status(400).send({ error: "la fecha es necesaria" });
		} else if (!Array.isArray(guests) || !guests.length) {
			return res.status(400).send({ error: "Guests must be an array" });
		}

		const formatDate = new Date(date);
		const member = await Member.findById(user.memberId);
		const hostClub = await Club.findById(user.clubId);
		if (!member || !hostClub) {
			return res
				.status(404)
				.send({ error: "couln't find that club or user 🤨" });
		}
		//! We need to seriously find a way to make this a reusable function

		let payingGuest = []; // Non member guests have to pay
		let memberGuest = []; // Guests with membership don't pay
		for (let guest of guests) {
			if (guest.membership) {
				// Validate membership legitimacy
				let response = await Member.findOne({
					membership: guest.membership,
					clubId: hostClub._id,
				});

				if (response) {
					memberGuest.push({ ...guest, name: response.firstName });
				} else {
					return res
						.status(404)
						.send({ error: "Member was given an invalid membership" });
				}
			} else {
				// Bill price is retrieved from club.guestPrice
				payingGuest.push({ ...guest, bill: club.guestPrice });
			}
		}
		// Create game
		const game = await Game.create({
			clubId: user.clubId,
			memberId: user.memberId,
			membership: member.membership,
			memberName: member.firstName,
			date: formatDate,
			guests: [...payingGuest, ...memberGuest],
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
		const startDate = new Date(new Date().setHours(0, 0, 0, 0));
		const endDate = addDays(startDate, 1);
		const findParams = isMember
			? { memberId: user.memberId }
			: { clubId: user.clubId };
		const games = await Game.find({
			date: {
				$gte: startDate,
				$lt: endDate,
			},
			...findParams,
		});
		return res.status(200).send(games);
	} catch (error) {
		console.log(error);
		return res.status(500).send({ error: error.message });
	}
};

const manageGame = async (req, res) => {
	try {
		const { params, body, user } = req;
		let { status } = await body;

		if (user.role === "member") {
			status = "cancelled";
		}

		if (!status) {
			return res.status(400).send({ error: "Game status is required" });
		}

		const game = await Game.findOne({ _id: params.id });
		if (!game) {
			return res
				.status(404)
				.send({ error: "Game id does not match any existing game" });
		}

		if (status === "start") {
			let start = await game.canStart();
			if (start) {
				return res
					.status(406)
					.send({ error: `Payments Missing`, payload: start });
			}
		}
		game.status = status;
		await game.save();
		return res.status(200).send(game);
	} catch (err) {
		console.log(err);
	}
};

// ! unfinished function
const addGuests = async (req, res) => {
	const { body, params, user } = req;
	const { guests } = body;
	const game = await Game.findOne({ _id: `${params.id}` });
	const club = await Game.findOne({ _id: user.clubId });

	if (!game) {
		return res
			.status(404)
			.send({ error: "Guest id doesn't match any existing game" });
	}
	if (!guests) {
		return res.status(400).send({ error: "At least 1 guest is required" });
	}
	if (!Array.isArray(guests) || !guests.length) {
		return res.status(400).send({ error: "Guests must not be an empty array" });
	}

	//! We need to seriously find a way to make this a reusable function
	let payingGuest = []; // Non member guests have to pay
	let memberGuest = []; // Guests with membership don't pay
	for (let guest of guests) {
		if (guest.membership) {
			// Validate membership legitimacy
			let response = await Member.findOne({
				membership: guest.membership,
				clubId: user.clubId,
			});

			if (response) {
				memberGuest.push({ ...guest, name: response.firstName });
			} else {
				return res
					.status(404)
					.send({ error: "Member was given an invalid membership" });
			}
		} else {
			// Bill price is retrieved from club.guestPrice
			payingGuest.push({ ...guest, bill: club.guestPrice });
		}
	}
	return res.status(200).send({ msg: "Success" });
};

// ? This function removes all the users with debt to start game
const forceGameStart = async (req, res) => {
	const { params } = req;
	const game = await Game.findById(params.id);
	if (!game) {
		return res
			.status(404)
			.send({ error: "Could not find any gaming with that id" });
	}
	await game.forceStart();
	return res.status(200).send({ msg: "test", game });
};

const deleteGame = async (req, res) => {
	try {
		const game = await Game.findOne({ _id: req.params.id });
		if (!game) {
			return res.status(404).send({ error: "couln't find that game 🤨" });
		}
		game.delete();
		return res.status(200).send({ msg: "Deleted Data 🔥", game });
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	createGame,
	getGames,
	manageGame,
	deleteGame,
	addGuests,
	forceGameStart,
};
