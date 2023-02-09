const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  mobileNumber: { type: String, required: true },
  adminName: { type: String, required: true },
  email: { type: String, required: true },
  adminImage: { type: String, required: true },
});

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
