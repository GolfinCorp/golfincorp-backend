const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  newUser: { type: Boolean, default: true },

  clubId: { type: String, required: true },
  memberId: { type: String, required: false },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
