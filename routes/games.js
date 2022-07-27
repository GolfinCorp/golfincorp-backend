const express = require("express");
const router = express.Router();

const { createGame, getGames, manageGame } = require("../controllers/games");
const { tokenValidate } = require("../middlewares/auth");

router.get("/", tokenValidate, getGames);
router.put("/manage", tokenValidate, manageGame);
router.post("/create", tokenValidate, createGame);
module.exports = router;
