const express = require("express");
const router = express.Router();
const verifyToken = require("../../verifyToken");
const MCQCollection = require("../../model/MCQCollection");
const MCQQuestion = require("../../model/MCQQuestion");
const MCQResult = require("../../model/MCQResult");

const mailer = require("../mailer");

// Get All with collection and topic Question
router.post("/", async (req, res) => {
  const allQuestion = await MCQQuestion.find({
    collectionId: req.body.collectionId,
    topic: req.body.topic,
  }).limit(10);
  res.json(allQuestion);
});

// Get all mcq
router.get("/all", async (req, res) => {
  const allQuestion = await MCQQuestion.find().populate("collectionId");
  res.json(allQuestion);
});

// Delete MCQ with id
router.post("/delete", async (req, res) => {
  const allQuestion = await MCQQuestion.deleteOne({ _id: req.body.mcqId });
  res.json(allQuestion);
});

// Delete MCQ with id
router.post("/update", async (req, res) => {
  const allQuestion = await MCQQuestion.updateOne(
    { _id: req.body.mcqId },
    { $set: req.body }
  );
  res.json(allQuestion);
});

// get the topics within collection
router.post("/topics", async (req, res) => {
  const collectionId = req.body.collectionId;
  let allTopics = [];
  if (collectionId) {
    allTopics = await MCQQuestion.find({
      collectionId: collectionId,
    }).distinct("topic");
  } else {
    allTopics = await MCQQuestion.find({}).distinct("topic");
  }

  res.json(allTopics);
});

// Add a Question
router.post("/add", verifyToken, async (req, res) => {
  const { collectionId, question, options, answer } = req.body;
  if (!collectionId)
    return res.status(500).json({ massage: "Invalid collection" });
  if (!question) return res.status(500).json({ massage: "Qustion invalid" });
  if (!options) return res.status(500).json({ massage: "No Options" });
  if (!answer) return res.status(500).json({ massage: "Invalid answer" });
  try {
    const newQuestion = await MCQQuestion.create(req.body);
    newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// result

//  Add result
router.post("/result", async (req, res) => {
  try {
    const result = await MCQResult(req.body);

    mailer({
      to: result.email,
      subject: `OA MCQ Result for ${result.topic}`,
      content: `Hi ${result.username}\n\t Check your answers here https://oceanacademy.co.in/mcq/result/${result._id}`,
      responseMailer: (error, info) => {
        if (error) {
          res.status(500).json({ error: error.message });
        } else {
          result.save();
          res.status(201).json(result);
        }
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get result with resultId
router.get("/result/:resultId", async (req, res) => {
  try {
    const result = await MCQResult.findById(req.params.resultId).populate(
      "collectionId"
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
