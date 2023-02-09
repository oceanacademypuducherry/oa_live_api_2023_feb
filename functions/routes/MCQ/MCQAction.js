const express = require("express");
const router = express.Router();
const verifyToken = require("../../verifyToken");
const MCQCollection = require("../../model/MCQCollection");

// get all collections
router.get("/get/collections", async (req, res) => {
  try {
    const allCollections = await MCQCollection.find();
    res.json(allCollections);
  } catch (error) {
    res.json({ error: error.message });
  }
});

// add new mcq collection
router.post("/add/collection", verifyToken, async (req, res) => {
  const { bgColor, languageImage, languageName } = req.body;
  console.log(bgColor, languageImage, languageName);
  if (!languageImage) {
    return res.status(500).json({ error: "invalid image" });
  }
  if (!languageName) {
    return res.status(500).json({ error: "invalid name" });
  }
  try {
    const mcqCollection = await MCQCollection({
      bgColor: bgColor,
      languageImage: languageImage,
      languageName: languageName,
    });
    mcqCollection.save();
    res.json({ mcq: mcqCollection });
  } catch (e) {
    console.log(e.message);
    res.json({ mcq: e.message });
  }
});

router.post("/delete/collection", async (req, res) => {
  const deleteMcq = await MCQCollection.deleteOne({
    _id: req.body.collectionId,
  });
  res.json({ deleteMcq: deleteMcq });
});

// delete all MCQ collections
router.delete("/", async (req, res) => {
  const deleteMcq = await MCQCollection.deleteMany({});
  res.json({ deleteMcq: deleteMcq });
});

module.exports = router;
