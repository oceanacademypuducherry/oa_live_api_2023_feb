const mongoose = require("mongoose");

const webinarMentor = new mongoose.Schema({
  mentorName: { type: String, required: true },
  designation: { type: String, default: "" },
  mentorImage: { type: String, default: "" },
  aboutMentor: { type: String, default: "" },
  mentorEmail: { type: String },
  mobileNumber: { type: String },
});

module.exports = mongoose.model("WebinarMentor", webinarMentor);
