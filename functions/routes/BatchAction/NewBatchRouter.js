const express = require("express");
const mongoose = require("mongoose");
const Batch = require("../../model/Batch");
const BatchStudent = require("../../model/BatchStudent");
const Purchase = require("../../model/Purchase");
const User = require("../../model/User");
const Schedule = require("../../model/Schedule");
const Trainer = require("../../model/Trainer");
const Course = require("../../model/Course");
const verifyToken = require("../../verifyToken");

const router = express.Router();

//
router.post("/options", verifyToken, async (req, res) => {
  const allPurchase = await Purchase.find({ hasBatch: false }).populate(
    "course"
  );
  console.log(allPurchase);
  const allTrainers = await Trainer.find().distinct("_id");
  let unassignedBatch = [];
  let tempCodeList = [];
  try {
    for (let purchase of allPurchase) {
      let testBatch = await Batch.find({
        courseId: purchase.courseId,
        batchTime: purchase.batchTime,
        batchType: purchase.batchType,
      });
      // console.log("bbbbbbbbb----------", testBatch);
      let batchWithTrainer = await Batch.find({
        batchTime: purchase.batchTime,
        batchType: purchase.batchType,
      }).distinct("trainer");

      batchWithTrainer = batchWithTrainer.map((item) => `${item["_id"]}`);
      console.log(batchWithTrainer, "qqqqqqqqqqqqqq");
      let availableTrainers = [];

      for (let item of allTrainers) {
        if (!batchWithTrainer.includes(`${item["_id"]}`)) {
          let trainerInfo = await Trainer.findById(item);
          availableTrainers.push(trainerInfo);
        }
      }
      console.log(availableTrainers);
      let tempCode =
        purchase.courseId + purchase.batchTime + purchase.batchType;
      // console.log(tempCode);
      if (!tempCodeList.includes(tempCode)) {
        let batchData = purchase.toObject();
        tempCodeList.push(tempCode);
        // console.log(tempCode, "=================>");
        let getCourseId = await Course.findOne({
          courseId: purchase.courseId,
        });
        console.log(getCourseId);
        console.log(purchase.courseId);
        const userfilter = {
          course: `${getCourseId["_id"]}`,
          batchTime: purchase.batchTime,
          batchType: purchase.batchType,
          hasBatch: false,
        };
        // console.log(userfilter, "wwwwwwwwwwwwwwwwwwwwwwwww");

        let thisBatchUsers = await Purchase.find(userfilter).populate("user");
        // console.log(thisBatchUsers);

        batchData.users = thisBatchUsers;
        batchData.availableTrainer = availableTrainers;
        delete batchData.user;
        unassignedBatch.push(batchData);
      }
    }
    res.json(unassignedBatch);
  } catch (e) {
    console.log(e);
    res.json({ message: "Somthing went Wrong" });
  }
});

// add batch
router.post("/add", verifyToken, async (req, res) => {
  let users = req.body.users;
  // console.log(users);
  let bodyData = req.body;
  try {
    let batches = [];
    let thisCourse = await Course.findOne({ courseId: bodyData.courseId });
    let syllabus = [];
    let syllabusIndex = 0;
    thisCourse.syllabus.forEach((content, cindex) => {
      if (!content.topics || content.topics.length == 0) {
        syllabus.push({
          isCompleted: false,
          topic: content.title,
          index: syllabusIndex,
          title: content.title,
          titleId: cindex,
        });
        syllabusIndex++;
      }
      content.topics &&
        content.topics.forEach((topic, index) => {
          syllabus.push({
            isCompleted: false,
            topic: topic,
            index: syllabusIndex,
            title: content.title,
            titleId: cindex,
          });
          syllabusIndex++;
        });
    });
    // for (let topic of thisCourse.syllabus) {

    // }
    const batch = new Batch({ ...bodyData, syllabus: syllabus });
    const newBatch = await batch.save();
    console.log("=======*********======");
    console.log(thisCourse);
    let batchId = newBatch["_id"];
    console.log(newBatch);
    console.log("=========********====");
    for (let user of users) {
      let userId = user.user["_id"];
      console.log(userId);
      const assignBatch = await BatchStudent({ batch: batchId, user: userId });
      const assignBatchSaved = await assignBatch.save();
      const purchaseUpdate = await Purchase.findById(user["_id"]);
      purchaseUpdate.hasBatch = true;
      await purchaseUpdate.save();

      batches.push(assignBatchSaved);
    }

    res.status(201).json(batches);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// get all batch
router.post("/all", verifyToken, async (req, res) => {
  const allBatchList = await Batch.find().populate("trainer");
  // let allBatchList = [];

  let updatedBatch = [];
  try {
    for (let batch of allBatchList) {
      let completedTopics = [];

      let userList = [];
      let users = await BatchStudent.find({ batch: batch["_id"] }).populate(
        "user"
      );
      userList = users.map((user) => user.user);
      let editedBatch = batch.toObject();

      editedBatch.users = userList;
      updatedBatch.push(editedBatch);
    }

    res.json(updatedBatch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

async function batchMiddlewere(req, res, next) {
  let batch;
  try {
    batch = await Batch.find().populate("student").populate("trainer");
    if (batch == null)
      return res.status(404).json({ message: "file not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  res.batch = batch;
  next();
}

// TODO: testing
router.post("/hasBatch", async (req, res) => {
  let test = await Purchase.updateMany({ hasBatch: false });
  await BatchStudent.deleteMany({});
  res.json(test);
});
router.post("/deleteAll", async (req, res) => {
  let test = await Batch.deleteMany({});
  res.json(test);
});
router.post("/deleteSchedule", async (req, res) => {
  let test = await Schedule.deleteMany({});
  res.json(test);
});

module.exports = router;
