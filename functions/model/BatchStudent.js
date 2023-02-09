const mongoose = require("mongoose");
const batchSchema = mongoose.Schema({
  batch: { type: mongoose.SchemaTypes.ObjectId, ref: "Course" },
  user: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
});

module.exports = mongoose.model("BatchStudent", batchSchema);
