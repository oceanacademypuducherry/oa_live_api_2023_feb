const mongoose = require("mongoose");

const TrainerSchema = new mongoose.Schema({
  trainerName: { type: String, required: true },
  designation: { type: String },
  skills: { type: Array },
  email: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  profilePicture: { type: String, default: null },
});

module.exports = mongoose.model("Trainer", TrainerSchema);
