const express = require("express");
const router = express.Router();
const { tokenValidate, requireAdmin } = require("../middlewares/auth");
const { idValidator } = require("../middlewares/validations");
const {
	createGame,
	getGames,
	getGamesByDay,
	manageGame,
	deleteGame,
	addGuests,
	forceGameStart,
} = require("../controllers/games");

router.use(tokenValidate);
router.get("/", getGames);
router.get("/filter", getGamesByDay);
router.post("/", createGame);
router.delete("/:id", idValidator, deleteGame);
router.patch("/:id", idValidator, manageGame);
router.post("/:id/force", requireAdmin, forceGameStart);

router.post("/:id/add-guest", idValidator, addGuests);

module.exports = router;
