const express = require("express");
const router = express.Router();

const { createClub } = require("../controllers/clubs");

router.post("/create", createClub);

module.exports = router;
