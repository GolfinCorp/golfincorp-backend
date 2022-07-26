const express = require("express");
const router = express.Router();
const { tokenValidate } = require("../middlewares/auth");
const { login, getUserData } = require("../controllers/users");

router.post("/login", login);

router.get("/auth", tokenValidate, getUserData);

module.exports = router;
