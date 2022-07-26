const Club = require("../models/Club");
const User = require("../models/User");
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
    console.log(hashedPassword);
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
        admin: { email: superUser.email, role: superUser.role },
      },
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { createClub };
