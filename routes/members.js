const express = require("express");
const router = express.Router();
const { createMember, deleteMember } = require("../controllers/members");
const { tokenValidate } = require("../middlewares/auth");

router.post("/create", tokenValidate, createMember);
router.delete("/delete", tokenValidate, deleteMember);

module.exports = router;
