const Member = require("../models/Members");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const createMember = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(401).send({ error: "Administrator rights required" });
    }

    const { firstName, lastname, membership, email } = req.body;
    if (!firstName || !lastname || !membership || !email) {
      return res.status(400).send({
        error: "Email, first name, lastname and membership are required",
      });
    }

    const clubId = req.user.clubId;
    const clubMembers = await Member.find({ clubId });
    const memberInUse = clubMembers.some(
      (elm) => elm.membership === membership
    );

    const isUser = await User.findOne({ email });
    if (memberInUse) {
      return res
        .status(406)
        .send({ error: "The membership number is already taken" });
    }
    if (isUser) {
      return res.status(400).send({ error: "This email already in use" });
    }
    const memberResponse = await Member.create({
      firstName,
      lastname,
      membership,
      email,
      clubId,
    });

    const provitionalPassword = `${firstName.toLowerCase()}${membership}`;
    const hashedPassword = await bcrypt.hash(provitionalPassword, saltRounds);
    const user = await User.create({
      email,
      password: hashedPassword,
      role: "member",
      clubId: clubId,
      memberId: memberResponse._id,
    });

    return res.status(200).send({ user, member: memberResponse });
  } catch (err) {
    return res.status(500).send({ error: err });
  }
};

const updateMember = async (req, res) => {
  try {
    const { firstName, lastname, membership } = req.body;
    console.log(req.params.memberId);
    const member = await Member.findOne({ _id: req.params.memberId });

    // Fields validation
    if (!req.params.memberId) {
      return res.status(400).send({ msg: "Member Id is required" });
    } else if (!firstName && !lastname && !membership) {
      return res.status(400).send({
        msg: "Either the firstname, lastname or membership are required to update",
      });
    } else if (!member) {
      return res.status(404).send({
        error: "Member id does not match any existing member",
      });
    }
    const updatedMember = await Member.findOneAndUpdate(req.body);

    return res
      .status(200)
      .send({ msg: "Member updated successfully", updateMember });
  } catch (err) {
    return res.status(500).send({ error: err });
  }
};

const deleteMember = async (req, res) => {
  try {
    const { memberId } = req.body;
    if (req.user.role !== "admin") {
      return res.status(401).send({ error: "Administrator rights required" });
    } else if (!memberId) {
      return res
        .status(400)
        .send({ error: "Membership identifier is required" });
    }

    const member = await Member.findOneAndDelete({ _id: memberId });
    if (!member) {
      return res
        .status(404)
        .send({ error: "Member id does not match any existing ID" });
    } else {
      return res
        .status(200)
        .send({ msg: "Member deleted successfully", response: member });
    }
  } catch (err) {
    return res.status(500).send({ error: err });
  }
};

module.exports = { createMember, updateMember, deleteMember };
