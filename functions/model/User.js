const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, default: "" },
  gender: { type: String, default: "" },
  dateOfBirth: { type: Date, default: Date.now() },
  email: { type: String, required: true },
  occupation: { type: String, default: "student" },
  instOrOrg: { type: String, default: "" },
  state: { type: String, default: "" },
  country: { type: String, default: "" },
  mobileNumber: { type: String, required: true },
  profilePicture: { type: String, default: "" },
  skills: Array,
});

module.exports = mongoose.model("User", UserSchema);
