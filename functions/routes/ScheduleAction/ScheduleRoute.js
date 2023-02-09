const express = require("express");
const mongoose = require("mongoose");
const Batch = require("../../model/Batch");
const BatchStudent = require("../../model/BatchStudent");
const Purchase = require("../../model/Purchase");
const User = require("../../model/User");
const Trainer = require("../../model/Trainer");
const Course = require("../../model/Course");
const Schedule = require("../../model/Schedule");
const router = express.Router();
const verifyToken = require("../../verifyToken");

// get batches with trainer token
router.post("/batch", verifyToken, async (req, res) => {
  try {
    const trainerId = req.user["_id"];
    const trainerInfo = await Trainer.findById(trainerId);
    if (trainerInfo === null)
      res.status(500).json({ message: "trainer not found" });

    let trainerBatches = [];
    let batches = await Batch.find({ trainer: trainerId }).populate("course");
    for (let batch of batches) {
      batch = batch.toObject();
      let batchStudent = await BatchStudent.find({ batch: batch["_id"] })
        .select("user")
        .populate("user");
      batchStudent = batchStudent.map((item) => {
        item = item.toObject();

        return item.user;
      });
      delete batch["__v"];
      batch.users = batchStudent;
      trainerBatches.push(batch);
    }

    res.status(200).json(trainerBatches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// add schedule
router.post("/add", verifyToken, async (req, res) => {
  let scheduleData = req.body;
  try {
    const userList = req.body.users;
    const batchId = req.body.batchId;
    const topicIndexs = req.body.topicIndex;
    let batchSyllabus = await Batch.findById(batchId);
    let syllabus = batchSyllabus.syllabus;
    topicIndexs.forEach((topicIndex) => {
      syllabus[topicIndex].isCompleted = true;
    });
    let completedCount = 0;
    syllabus.forEach((completedTopic) => {
      console.log(completedTopic);
      if (completedTopic.isCompleted) {
        completedCount += 1;
      }
    });

    const courseProgress = (completedCount / syllabus.length) * 100;

    delete scheduleData.users;
    let scheduledUser = [];
    for (let user of userList) {
      let addSchedule = scheduleData;
      addSchedule.user = user;
      let batchStudent = await Schedule(addSchedule);
      await batchStudent.save();
      scheduledUser.push(batchStudent);
    }
    await Batch.updateOne(
      { _id: batchId },
      {
        $set: { syllabus: syllabus, courseProgress: courseProgress.toFixed(0) },
      }
    );

    res.status(201).json(scheduledUser);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

// ! not use have to connect admin batch card
router.post("/view/:courseId", verifyToken, async (req, res) => {
  let courseId = req.params.courseId;
  let user = req.user;

  const schedules = await Schedule.find({
    user: user["_id"],
    courseId: courseId,
    // isCompleted: false,
  })
    .populate("trainer")
    .populate("user");
  const course = await Course.findOne({ courseId: courseId });

  res.json({ schedules: schedules, user: user, course: course });
});

router.post("/all", verifyToken, async (req, res) => {
  const trainerId = req.user["_id"];
  const courseId = await Schedule.find({ trainer: trainerId }).distinct(
    "courseId"
  );
  const schedule = await Schedule.find({ trainer: trainerId }).sort({
    isCompleted: 1,
  });
  const allFilteredSchedule = [];
  let scheduleCode = "";
  schedule.map((sch) => {
    const code = `${sch.classDate}${sch.batchTime}${sch.batchType}${sch.courseId}`;
    if (scheduleCode !== code) {
      scheduleCode = code;
      allFilteredSchedule.push(sch);
    }

    console.log(code);
  });
  res.status(200).json({ schedules: allFilteredSchedule, courseIds: courseId });
});

// is join
router.post("/isJoin", verifyToken, async (req, res) => {
  const scheduleId = req.body.scheduleId;
  const isJoin = req.body.isJoin;
  let isJoinUpdate = await Schedule.findByIdAndUpdate(scheduleId, {
    isJoin: isJoin,
  });
  await isJoinUpdate.save();
  console.log(isJoinUpdate);
  res.json(isJoinUpdate);
});

// is completed
router.post("/isCompleted", verifyToken, async (req, res) => {
  const scheduleId = req.body.scheduleId;
  const isCompleted = req.body.isCompleted;
  let isCompletedUpdate = await Schedule.findByIdAndUpdate(scheduleId, {
    isCompleted: isCompleted,
  });
  await isCompletedUpdate.save();
  console.log(isCompletedUpdate);
  res.json(isCompletedUpdate);
});

module.exports = router;
