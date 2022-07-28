const Game = require("../models/Game");
const Member = require("../models/Members");
const router = require("../routes/games");
const ObjectId = require("mongoose").Types.ObjectId;

const createGame = async (req, res) => {
  try {
    const { date, guests } = req.body;
    if (!date) {
      return res.status(400).send({ error: "la fecha es necesaria" });
    }
    const formatDate = new Date(date);
    const member = await Member.findOne({ _id: req.user.memberId });

    const gameResponse = await Game.create({
      clubId: req.user.clubId,
      memberId: member._id,
      membership: member.membership,
      memberName: member.firstName,
      date: formatDate,
      guests,
    });

    return res.status(200).send({ game: gameResponse });
  } catch (err) {
    console.log(err);
  }
};

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

    const gameRespone = await Game.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );
    return res.status(200).send(gameRespone);
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

const deleteGame = async (req, res) => {
  try {
    const gameExist = await Game.findOne({ _id: req.params.id });
    if (!gameExist) {
      return res
        .status(404)
        .send({ error: "Game id provided does not match any existing game" });
    }

    const deleteResponse = await Game.deleteOne({ _id: req.params.id });
    return res
      .status(200)
      .send({ msg: "Game deleted succesfully", deleteResponse });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createGame, getGames, manageGame, deleteGame, addGuests };
