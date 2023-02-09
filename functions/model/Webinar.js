const mongoose = require("mongoose");

const webinar = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  bannerImage: { type: String, default: "" },
  course: { type: String, default: "" },
  enrolledCount: { type: Number, default: 100 },
  duration: { type: Number },
  isFree: { type: Boolean, default: false },
  isComplete: { type: Boolean, default: false },
  price: { type: Number, default: 0 },
  promoVideo: { type: String, default: "" },
  topics: { type: Array },
  startAt: { type: Date },
  mentor: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "WebinarMentor",
    required: true,
  },
  mentorZoomLink: { type: String, default: "" },
  userZoomLink: { type: String, default: "" },
});

module.exports = mongoose.model("Webinar", webinar);
