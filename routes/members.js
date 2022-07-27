const express = require("express");
const router = express.Router();
const { createMember } = require("../controllers/members");
const { tokenValidate } = require("../middlewares/auth");

router.post("/create", tokenValidate, createMember);

module.exports = router;
