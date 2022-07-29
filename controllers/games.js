const Club = require("../models/Club");
const Game = require("../models/Game");
const Member = require("../models/Members");
const Payment = require("../models/Payment");

// ? If member gets all his game, else get all the club games
const getGames = async (req, res) => {
  try {
    const games = await Game.find(
      req.user.memberId
        ? { memberId: req.user.memberId }
        : { clubId: req.user.clubId }
    );
    return res.status(200).send(games);
  } catch (err) {
    console.log(err);
  }
};

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
    const member = await Member.findOne({ _id: user.memberId });
    const hostClub = await Club.findOne({ _id: user.clubId });

    // Validate which guests have to be charged($), and generate a "bill"
    let payingGuest = []; // Non member guests have to pay
    let memberGuest = []; // Guests with membership don't pay
    for (let i = 0; i < guests.length; i++) {
      if (guests[i].membership) {
        // Validate membership legitimacy
        let response = await Member.findOne({
          membership: guests[i].membership,
          clubId: user.clubId,
        });
        if (response) {
          memberGuest.push({ ...guests[i], name: response.firstName });
        } else {
          return res
            .status(404)
            .send({ error: "Member was given an invalid membership" });
        }
      } else {
        // Bill price is retrieved from club.guestPrice
        payingGuest.push({ ...guests[i], bill: hostClub.guestPrice });
      }
    }

    // Create game
    const gameResponse = await Game.create({
      clubId: user.clubId,
      memberId: user.memberId,
      membership: member.membership,
      memberName: member.firstName,
      date: formatDate,
      guests: [...memberGuest, ...payingGuest],
    });
    return res.status(200).send({ game: gameResponse });
  } catch (err) {
    console.log(err);
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
      return res.status(400).send({ error: "Game status and id are required" });
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

const addGuests = async (req, res) => {
  const { body, params, user } = req;
  const gameExists = await Game.findOne({ _id: `${params.id}` });
  if (!gameExists) {
    return res
      .status(404)
      .send({ error: "Guest id doesn't match any existing game" });
  }
  if (!body.guests) {
    return res.status(400).send({ error: "At least 1 guest is required" });
  }
  if (!Array.isArray(body.guests) || !body.guests.length) {
    return res.status(400).send({ error: "Guests must not be an empty array" });
  }
  return res.status(200).send({ msg: "Success" });
};

// This function removes all the users with debt to start game
const forceGameStart = async (req, res) => {
  const { params } = req;
  const game = await Game.findById(params.id);
  if (!game) {
    return res
      .status(404)
      .send({ error: "Could not find any gaming with that id" });
  }
  const validGuests = game.getDebtFree();
  game.guests = [...validGuests];
  game.status = "start";
  game.save();
  return res.status(200).send({ msg: "test", game });
};

const deleteGame = async (req, res) => {
  try {
    const game = await Game.findOne({ _id: req.params.id });
    if (!game) {
      return res
        .status(404)
        .send({ error: "Game id provided does not match any existing game" });
    }
    game.delete();
    return res.status(200).send({ msg: "Game deleted succesfully", game });
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
