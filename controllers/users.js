// ? Encription Module https://github.com/kelektiv/node.bcrypt.js#readme
const bcrypt = require("bcrypt");

const User = require("../models/User");
const Club = require("../models/Club");
const { generateAccessToken } = require("../middlewares/auth");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(406).send({ error: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      const token = generateAccessToken({
        role: user.role,
        email: user.email,
        memberId: user.memberId || null,
        clubId: user.clubId,
      });
      return res.json({ token });
    } else {
      return res.status(406).send({ error: "Incorrect Password" });
    }
  } catch (err) {
    console.log(err);
  }
};

const getUserData = (req, res) => {
  return res.status(200).send({ msg: "Sos alto pro" });
};

module.exports = { login, getUserData };
