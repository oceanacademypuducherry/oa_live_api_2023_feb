const mongoose = require("mongoose");

const resultSchema = mongoose.Schema({
  answerKey: { type: Array, required: true },
  collectionId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "MCQCollection",
  },
  correct: { type: Number },
  email: { type: String },
  skiped: { type: Number },
  topic: { type: String, default: "Others" },
  totalQuestion: { type: Number },
  username: { type: String },
  wrong: { type: Number },
  date: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("MCQResult", resultSchema);
