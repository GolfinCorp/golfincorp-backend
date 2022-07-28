const express = require("express");
const router = express.Router();
const { tokenValidate } = require("../middlewares/auth");
const { idValidator } = require("../middlewares/validations");
const {
  createGame,
  getGames,
  manageGame,
  deleteGame,
  addGuests,
} = require("../controllers/games");

router.use(tokenValidate);
router.get("/", getGames);
router.delete("/:id", idValidator, deleteGame);
router.post("/create", createGame);
router.put("/manage/:id", manageGame);
router.patch("/manage/add/:id", idValidator, addGuests);

module.exports = router;
