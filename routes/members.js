const express = require("express");
const router = express.Router();
const {
  createMember,
  deleteMember,
  updateMember,
  getMembers,
} = require("../controllers/members");
const { tokenValidate, requireAdmin } = require("../middlewares/auth");

router.use(tokenValidate, requireAdmin);

router.get("/", getMembers);
router.post("/create", createMember);
router.delete("/delete", deleteMember);
router.put("/:memberId", updateMember);

module.exports = router;
