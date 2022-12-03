const express = require("express");
const router = express.Router();
const { generateClubObjects } = require("../utils/seedDb");
const { createClub, updateClub, getClub } = require("../controllers/clubs");
const { tokenValidate, requireAdmin } = require("../middlewares/auth");

router.post("/", createClub);
router.get("/", tokenValidate, requireAdmin, getClub);
router.patch("/", tokenValidate, requireAdmin, updateClub);
router.get("/seed", generateClubObjects);
module.exports = router;
