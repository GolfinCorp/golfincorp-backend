// ? Encription Module https://github.com/kelektiv/node.bcrypt.js#readme
const bcrypt = require("bcrypt");

const User = require("../models/User");
const Club = require("../models/Club");
const { generateAccessToken } = require("../middlewares/auth");

const saltRounds = 10;
const passwordRgx = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
const emailRgx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const userRegister = async (req, res) => {
  // ! Missing email regex validation
  try {
    const { email, username, age, password } = req.body;
    // Validate for empty request body
    if (!email || !password || !username || !age) {
      return res.json({ status: 406, error: "All fields are requires" });
    }

    // ? Email Validation
    if (email.length < 6) {
      return res.status(406).send({ error: "Invalid email adress" });
    }
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(302).send({ error: "Mail already in use" });
    }

    // ? Username Validation
    if (username.length < 4 || username.length > 10) {
      return res.status(406).send({
        error:
          "Username must be over 4 characters and under 10 characters long",
      });
    }
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(302).send({ error: "Username already in use" });
    }

    // ? Age Validation
    if (typeof age !== "number") {
      return res.status(406).send({
        error: "Age must be a number between 18 and 110",
      });
    } else if (age < 18) {
      return res.status(406).send({
        error: "You must be over 18 years old to sign up",
      });
    } else if (age > 110) {
      return res.status(406).send({
        error:
          "Congrats on making it to 110+ Years, sorry boomer but you must be younger to use our app :(",
      });
    }

    // ? Password validation
    if (password.length < 5 || password.length > 15) {
      return res.status(406).send({
        error:
          "Password must be over 5 characters and under 10 characters long",
      });
    } else if (!passwordRgx.test(password)) {
      return res.status(406).send({
        error:
          "Password must contain at least one capital letter and one number",
      });
    }

    // ? Encryption and creation of user instance
    let response;
    bcrypt.hash(password, saltRounds, async (error, hash) => {
      response = await User.create({
        username,
        email,
        password: hash,
        age,
      });
      return response;
    });
    return res.json({ data: req.body });
  } catch (error) {
    return res.json({ error: error });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(406).send({ error: "All fields are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send({ error: "User not found" });
  }

  let token;
  if (bcrypt.compare(password, user.password)) {
    token = generateAccessToken({
      role: user.role,
      email: user.email,
      memberId: user.memberId || null,
      clubId: user.clubId,
    });
  } else {
    return res.status(406).send({ error: "Incorrect Password" });
  }
  return res.json({ token });
};

const getUserData = (req, res) => {
  console.log("hi");
  return;
};

module.exports = { userRegister, login, getUserData };
