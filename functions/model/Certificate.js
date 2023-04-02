const mongoose = require("mongoose");

const certificateSchema = mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  certificateUrl: { type: String, required: true },
  certificateEarned: { type: String, required: true },
  courseCompleted: { type: String, required: true },
  studentName: { type: String, required: true },
  studentProfile: { type: String },
  learnedSkills: { type: Array },
});

module.exports = mongoose.model("Certificate", certificateSchema);
