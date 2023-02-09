const express = require("express");
const router = express.Router();
const verifyToken = require("../../verifyToken");
const Mentor = require("../../model/Mentor");

router.get("/", async (req, res) => {
  try {
    const allMentors = await Mentor.find();
    res.json(allMentors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/add", async (req, res) => {
  try {
    let newMentor = new Mentor(req.body);
    await newMentor.save();
    res.status(201).json(newMentor);
  } catch (e) {
    res.status(500);
  }
});

module.exports = router;
