const express = require("express");
const router = express.Router();
const OfflineCourse = require("../../model/OfflineCourse");
const verifyToken = require("../../verifyToken");
const DownloadedCourseUser = require("../../model/DownloadedOfflineCourse");

//  get all course
router.get("/", async (req, res) => {
  try {
    const allOfflineCourse = await OfflineCourse.find();
    res.status(200).json(allOfflineCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// add offline course
router.post("/add", verifyToken, async (req, res) => {
  const bodyData = req.body;
  try {
    const addOfflineCourse = await OfflineCourse(bodyData);
    addOfflineCourse.save();

    res.status(201).json(addOfflineCourse);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// get course with id
router.get("/get/:courseId", async (req, res) => {
  const bodyData = req.body;
  try {
    const updateOfflineCourse = await OfflineCourse.findOne({
      courseId: req.params.courseId,
    });
    // await updateOfflineCourse.save();

    res.status(200).json(updateOfflineCourse);
  } catch (e) {
    res.status(500).json(e.message);
  }
});

// update course
router.put("/update", verifyToken, async (req, res) => {
  const bodyData = req.body;
  try {
    await OfflineCourse.updateOne({ _id: bodyData.docId }, { $set: bodyData });

    res.status(200).json({
      message: "Offline course updated sussfully",
    });
  } catch (e) {
    res.status(500).json(e.message);
  }
});

// delete ofline course
router.post("/delete", async (req, res) => {
  try {
    const course = await OfflineCourse.findById(req.body.docId);
    course.remove();
    res
      .status(201)
      .json({ message: course.courseName + " removed successfully" });
  } catch (e) {
    res.status(400).json(e.message);
  }
});

// all downloaded user
router.get("/get/all/users", async (req, res) => {
  try {
    const allData = await DownloadedCourseUser.find();
    res.json(allData);
  } catch (error) {
    res.json({ message: error.message });
  }
});

module.exports = router;
