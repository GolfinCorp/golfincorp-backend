const express = require("express");
const router = express.Router();

const { createClub, getMembers } = require("../controllers/clubs");
const { tokenValidate } = require("../middlewares/auth");

router.post("/create", createClub);
router.get("/members", tokenValidate, getMembers);

module.exports = router;
