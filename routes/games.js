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
router.delete("/:id", idValidator, deleteGame);
router.post("/create", createGame);
router.put("/manage/:id", manageGame);
router.put("/manage/force/:id", requireAdmin, forceGameStart);

router.patch("/manage/add/:id", idValidator, addGuests);

module.exports = router;
