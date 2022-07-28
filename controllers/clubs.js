const Club = require("../models/Club");
const User = require("../models/User");
const Member = require("../models/Members");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const createClub = async (req, res) => {
  try {
    const { email, name, state, country, subscription } = req.body;

    if ((!email, !name, !state, !country, !subscription)) {
      return res.status(400).send({ error: "All fields are required" });
    }

    const provitionalPassword = name.replaceAll(" ", "_").toLowerCase();
    const hashedPassword = await bcrypt.hash(provitionalPassword, saltRounds);
    const clubResponse = await Club.create({
      email,
      name,
      state,
      country,
      subscription: {
        start_date: new Date(),
        plan: subscription.plan,
        price: subscription.price,
      },
    });
    let superUser = await User.create({
      email,
      password: hashedPassword,
      role: "admin",
      clubId: clubResponse._id,
    });

    return res.status(200).send({
      data: {
        club: clubResponse,
        admin: {
          email: superUser.email,
          role: superUser.role,
          password: provitionalPassword,
        },
      },
    });
  } catch (err) {
    console.log(err);
  }
};

const getClub = async (req, res) => {
  try {
    const { user } = req;
    const club = await Club.findById(user.clubId);
    return res.status(200).send(club);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
};

const updateClub = async (req, res) => {
  try {
    const { body, params, user } = req;
    const club = await Club.findOne({ _id: params.id });
    if (club._id !== user.clubId) {
      return res
        .status(401)
        .send({ error: "You're not a member of this club" });
    }
    if (!club) {
      return res
        .status(404)
        .send({ error: "There's no existing club with this id" });
    }
    // * UPDATE: Now it returns the updated instance
    const updatedClub = await Club.findByIdAndUpdate(club._id, body, {
      new: true,
    });
    return res.status(200).send({ club: updatedClub });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
};

module.exports = { createClub, updateClub, getClub };
