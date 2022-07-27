const express = require("express");
const router = express.Router();

const { createGame, getGamesByUser } = require("../controllers/games");
const { tokenValidate } = require("../middlewares/auth");

router.get("/", tokenValidate, getGamesByUser);
router.post("/create", tokenValidate, createGame);
module.exports = router;
