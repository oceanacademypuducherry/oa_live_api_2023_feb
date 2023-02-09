const express = require("express");
const router = express.Router();
const Course = require("../../model/Course");
const verifyToken = require("../../verifyToken");

//! not use
router.get("/batch/filter", async (req, res) => {
  try {
    const allCourse = await Course.find();
    res.status(200).json(allCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get All Course
router.get("/", async (req, res) => {
  try {
    const allCourse = await Course.find();

    res.status(200).json(allCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get a course with CourseID
router.get("/:courseId", getCourseMiddelwate, async (req, res) => {
  const course = await Course.findOne({ courseId: res.course.courseId });
  res.status(200).json(course);
});

// Add a Course
router.post("/add/course", verifyToken, async (req, res) => {
  const course = new Course(req.body);
  try {
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// update course
router.patch(
  "/:courseId",
  verifyToken,
  getCourseMiddelwate,
  async (req, res) => {
    if (req.body.duration != null) res.course.duration = req.body.duration;
    if (req.body.courseName != null)
      res.course.courseName = req.body.courseName;
    if (req.body.price != null) res.course.price = req.body.price;
    if (req.body.description != null)
      res.course.description = req.body.description;
    if (req.body.courseImage != null)
      res.course.courseImage = req.body.courseImage;
    if (req.body.syllabus != null) res.course.syllabus = req.body.syllabus;
    try {
      await res.course.save();
      res.status(200).json({
        message: `${res.course.courseName} Course Updated successfuly...`,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// delete course
router.delete("/:courseId", getCourseMiddelwate, async (req, res) => {
  try {
    await res.course.remove();
    res
      .status(200)
      .json({ message: `Deleted ${res.course.courseName} successfuly...` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// course middelware
async function getCourseMiddelwate(req, res, next) {
  let course;
  try {
    course = await Course.findOne({ courseId: req.params.courseId });
    if (course == null)
      return res.status(404).json({ message: "can't find the course" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  res.course = course;
  next();
}

module.exports = router;
