const express = require("express");
const router = express.Router();
const {
	createMember,
	deleteMember,
	updateMember,
	getMembers,
} = require("../controllers/members");
const { tokenValidate, requireAdmin } = require("../middlewares/auth");
const { idValidator } = require("../middlewares/validations");

router.use(tokenValidate, requireAdmin);

router.get("/", getMembers);
router.post("/", createMember);
router.delete("/:id", idValidator, deleteMember);
router.patch("/:id", idValidator, updateMember);

module.exports = router;
