const express = require("express");
const router = express.Router();
const { tokenValidate } = require("../middlewares/auth");
const {
	createGame,
	getGames,
	manageGame,
	deleteGame,
} = require("../controllers/games");

router.use(tokenValidate);
router.get("/", getGames);
router.put("/manage/:id", manageGame);
router.post("/create", createGame);
router.delete("/:id", deleteGame);

module.exports = router;
