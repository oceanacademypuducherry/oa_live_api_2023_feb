const mongoose = require("mongoose");

const downloadedCourseSchema = mongoose.Schema({
  courseId: { type: String, required: true },
  name: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true },
  date: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("DownloadedCourseUser", downloadedCourseSchema);
