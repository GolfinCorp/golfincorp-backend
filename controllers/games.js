const { restart } = require("nodemon");
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
const getGamesByUser = async (req, res) => {
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

module.exports = { createGame, getGamesByUser };
