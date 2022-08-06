const express = require("express");
const router = express.Router();
const { tokenValidate, requireAdmin } = require("../middlewares/auth");
const { idValidator } = require("../middlewares/validations");
const {
	createGame,
	getGames,
	manageGame,
	deleteGame,
	addGuests,
	forceGameStart,
} = require("../controllers/games");

router.use(tokenValidate);
router.get("/", getGames);
router.post("/", createGame);
router.delete("/:id", idValidator, deleteGame);
router.post("/:id", idValidator, manageGame);
router.put("/:id/force", requireAdmin, forceGameStart);

router.post("/:id/add-guest", idValidator, addGuests);

module.exports = router;
