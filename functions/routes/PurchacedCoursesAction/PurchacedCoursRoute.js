const express = require("express");
const router = express.Router();
const User = require("../../model/User");
const Course = require("../../model/Course");
const Purchase = require("../../model/Purchase");
const verifyUser = require("../../verifyToken");

// get all purchase list
router.get("/all", async (req, res) => {
  const allDtails = await Purchase.find().populate("user").populate("course");

  try {
    res.status(200).json(allDtails);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// get all Purchase history from user
router.post("/", verifyUser, async (req, res) => {
  const allDtails = await Purchase.find({ user: req.user["_id"] })
    .populate("course")
    .populate("user");
  try {
    res.status(200).json(allDtails);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Purchase course  with our CourseID
router.post("/:courseId", verifyUser, purchaseMiddelware, async (req, res) => {
  const { myPurchase } = res;
  try {
    const newPurchase = await myPurchase.save();
    res.status(201).json(newPurchase);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//  view purchase details
router.get("/details/:purchaseId", async (req, res) => {
  const purchaseDetails = await Purchase.findById(req.params.purchaseId);
  if (purchaseDetails == null)
    return res
      .status(404)
      .json({ message: "somthing went wrong please try again later" });
  try {
    res.status(200).json(purchaseDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// make has batch true
router.patch("/make/batch", async (req, res) => {
  try {
    let purchaseData = await Purchase.findById(req.body.purchaseId);
    purchaseData.hasBatch = req.body.hasBatch;
    await purchaseData.save();
    res.status(201).json(purchaseData);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// ! not use
router.delete("/delete/all", async (req, res) => {
  try {
    await Purchase.deleteMany({});
    res.json({ message: "all purchase was deleted" });
  } catch (error) {
    res.json({ message: error.message });
  }
});

async function purchaseMiddelware(req, res, next) {
  console.log(req.user["_id"], "pur ==> 80");
  let course;
  let user;
  let myPurchase;
  let isPurchased = false;
  let checkPurchase = await Purchase.find().populate("course").populate("user");
  checkPurchase.forEach((item) => {
    console.log(item);
    if (
      item.courseId === req.params.courseId &&
      `${item.user["_id"]}` === req.user["_id"]
    ) {
      isPurchased = true;
    }
  });
  if (req.body.isCheck) {
    if (isPurchased) {
      return res.json({
        error: "course already purchased isCheck",
        isPurchased: isPurchased,
      });
    } else {
      return res.json({
        error: false,
        isPurchased: isPurchased,
      });
    }
  }
  try {
    course = await Course.findOne({
      courseId: req.params.courseId,
    });
    user = await User.findById(req.user["_id"]);
    if (course == null || user == null)
      return res.status(404).json({ message: "Not found" });
    myPurchase = new Purchase(req.body);
    myPurchase.user = req.user["_id"];
    myPurchase.course = course["_id"];
    myPurchase.courseId = course.courseId;
    if (isPurchased) {
      return res.json({
        error: "course already purchased",
        isPurchased: isPurchased,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  res.myPurchase = myPurchase;
  next();
}

router.get("/test/:courseId", verifyUser, async (req, res) => {
  let course;
  let user;
  let checkPurchase = await Purchase.find().populate("course").populate("user");
  checkPurchase.forEach((item) => {
    console.log(item.course.courseId);
  });
  try {
    course = await Course.findOne({
      courseId: req.params.courseId,
    });
    user = await User.findById(req.user["_id"]);
    res.json({ checkPurchase });
  } catch (e) {
    res.json({ message: e.message });
  }
});

module.exports = router;
