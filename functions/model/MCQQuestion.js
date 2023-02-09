const mongoose = require("mongoose");

const qustionSchema = mongoose.Schema({
  collectionId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "MCQCollection",
  },
  question: { type: String, required: true },
  options: { type: Array, required: true },
  answer: { type: String, required: true },
  topic: { type: String, default: "other" },
  questionDescription: { type: String, default: "" },
  answerDesription: { type: String, default: "" },
});

module.exports = mongoose.model("MCQQuestion", qustionSchema);
