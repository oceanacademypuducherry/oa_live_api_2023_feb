const mongoose = require("mongoose");

const enquirySchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  selectedCoruse: { type: String, default: "" },
  description: { type: String, default: "" },
  queryDate: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("AlertEnquiry", enquirySchema);
