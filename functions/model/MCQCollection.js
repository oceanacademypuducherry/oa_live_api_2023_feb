const mongoose = require("mongoose");

const MCQCollectionSchema = mongoose.Schema({
  bgColor: { type: String, default: "#969696" },
  languageImage: { type: String, required: true },
  languageName: { type: String, required: true },
});

module.exports = mongoose.model("MCQCollection", MCQCollectionSchema);
