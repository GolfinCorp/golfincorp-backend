const express = require("express");
const router = express.Router();
const { tokenValidate } = require("../middlewares/auth");
const {
  createGame,
  getGames,
  manageGame,
  deleteGame,
} = require("../controllers/games");

router.get("/", tokenValidate, getGames);
router.put("/manage", tokenValidate, manageGame);
router.post("/create", tokenValidate, createGame);
router.delete("/delete", tokenValidate, deleteGame);

module.exports = router;
