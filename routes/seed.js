const express = require("express");
const router = express.Router();
const {
  generateClubObjects,
  generateMembers,
} = require("../controllers/backoffice/seedDb");

router.get("/clubs", generateClubObjects);
router.get("/members", generateMembers);

module.exports = router;
