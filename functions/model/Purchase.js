const mongoose = require("mongoose");

const purchaseSchema = mongoose.Schema({
  user: { type: mongoose.SchemaTypes.ObjectId, ref: "User", required: true },
  course: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Course",
    required: true,
  },
  purchasedDate: { type: Date, default: Date.now },
  batchTime: { type: String, default: null },
  courseId: { type: String, required: true },
  batchType: { type: String, default: "Week-Days" },
  query: { type: String },
  hasBatch: { type: Boolean, default: false },
  batch: { type: mongoose.SchemaTypes.ObjectId, ref: "Batch" },
});

module.exports = mongoose.model("Purchase", purchaseSchema);
