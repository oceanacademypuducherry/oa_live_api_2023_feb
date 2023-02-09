const express = require("express");
const router = express.Router();
const verifyToken = require("../../verifyToken");
const DownloadedCourseUser = require("../../model/DownloadedOfflineCourse");

router.get("/", async (req, res) => {
  const downloadeOflineCourse = await DownloadedCourseUser.find();
  res.status(200).json(downloadeOflineCourse);
});
router.post("/add/user/", async (req, res) => {
  try {
    const user = await DownloadedCourseUser.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/delete/user/", async (req, res) => {
  try {
    const deleteInfo = await DownloadedCourseUser.deleteOne({
      _id: req.body.userId,
    });
    res.status(200).json(deleteInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
