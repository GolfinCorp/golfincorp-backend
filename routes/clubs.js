const express = require("express");
const router = express.Router();

const {
  createClub,
  getMembers,
  updateClub,
  getClub,
} = require("../controllers/clubs");
const { tokenValidate, requireAdmin } = require("../middlewares/auth");

router.post("/create", createClub);
router.get("/", tokenValidate, requireAdmin, getClub);
router.put("/:id", tokenValidate, requireAdmin, updateClub);

module.exports = router;
