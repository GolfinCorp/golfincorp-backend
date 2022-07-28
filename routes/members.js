const express = require("express");
const router = express.Router();
const {
  createMember,
  deleteMember,
  updateMember,
} = require("../controllers/members");
const { tokenValidate } = require("../middlewares/auth");

router.post("/create", tokenValidate, createMember);
router.delete("/delete", tokenValidate, deleteMember);
router.put("/:memberId", tokenValidate, updateMember);

module.exports = router;
