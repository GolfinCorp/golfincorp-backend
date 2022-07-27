const express = require("express");
const router = express.Router();

const { createGame, getGames } = require("../controllers/games");
const { tokenValidate } = require("../middlewares/auth");

router.get("/", tokenValidate, getGames);
router.post("/create", tokenValidate, createGame);
module.exports = router;
