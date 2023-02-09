const mongoose = require("mongoose");

const secheduleSchema = mongoose.Schema({
  user: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: "User" },
  courseId: { type: String, required: true },
  batchId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "Batch",
  },
  trainer: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Trainer",
    required: true,
  },
  isJoin: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },
  batchTime: { type: String },
  batchType: { type: String },
  topic: { type: String, require: true },
  zoomLink: { type: String },
  recordedVideo: { type: String, default: null },
  classDate: { type: Date, default: Date.now() },
});

const Schedule = mongoose.model("Schedule", secheduleSchema);
module.exports = Schedule;
