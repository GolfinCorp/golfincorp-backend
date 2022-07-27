const Game = require("../models/Game");
const Member = require("../models/Members");

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
    let { status, gameId } = req.body;

    if (req.user.role === "member") {
      status = "cancelled";
    }

    if (!status || !gameId) {
      return res.status(400).send({ error: "Game status and id are required" });
    }

    const gameExists = await Game.findOne({ _id: gameId });
    if (!gameExists) {
      return res
        .status(404)
        .send({ error: "Gamd id does not match any existing game" });
    }

    const gameRespone = await Game.findByIdAndUpdate(
      { _id: gameId },
      { status: status }
    );
    return res.status(200).send(gameRespone);
  } catch (err) {
    console.log(err);
  }
};

const deleteGame = async (req, res) => {
  try {
    const { gameId } = req.body;
    if (!gameId) {
      return res.status(400).send({ error: "Game Id is required" });
    }

    const gameExist = await Game.findOne({ _id: gameId });
    if (!gameExist) {
      return res
        .status(404)
        .send({ error: "Game id provided does not match any existing game" });
    }

    const deleteResponse = await Game.deleteOne({ _id: gameId });
    return res
      .status(200)
      .send({ msg: "Game deleted succesfully", deleteResponse });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createGame, getGames, manageGame, deleteGame };
