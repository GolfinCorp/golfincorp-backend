const Member = require("../models/Members");
const User = require("../models/User");
const createMember = async (req, res) => {
  try {
    const { firstName, lastname, membership, email, billingDate, status } =
      req.body;
    if (!firstName || !lastname || !membership || !email) {
      return res.status(400).send({
        error: "Email, first name, lastname and membership are required",
      });
    }
    const isMember = await Member.findOne({ membership });
    const isUser = await User.findOne({ email });
    if (isMember) {
      return res.status(406).send({ error: "El numero de membresía ya esta " });
    }
    return res.status(200);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { createMember };
