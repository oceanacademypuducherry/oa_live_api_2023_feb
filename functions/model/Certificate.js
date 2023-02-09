const mongoose = require("mongoose");

const certificateSchema = mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  certificateUrl: { type: String, required: true },
});

module.exports = mongoose.model("Certificate", certificateSchema);
