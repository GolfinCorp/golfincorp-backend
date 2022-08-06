const express = require("express");
const router = express.Router();

const { createClub, updateClub, getClub } = require("../controllers/clubs");
const { tokenValidate, requireAdmin } = require("../middlewares/auth");

router.post("/", createClub);
router.get("/", tokenValidate, requireAdmin, getClub);
router.patch("/", tokenValidate, requireAdmin, updateClub);

module.exports = router;
