const express = require("express");
const router = express.Router();
const { createMember } = require("../controllers/members");

router.post("/create", createMember);

module.exports = router;
