const express = require("express");
const router = express.Router();
const Trainer = require("../../model/Trainer");
const Batch = require("../../model/Batch");
const jwt = require("jsonwebtoken");
const verifyToken = require("../../verifyToken");

// get all trainer
router.get("/", async (req, res) => {
  try {
    const allUser = await Trainer.find();
    res.json(allUser);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// create trainer
router.post("/create", async (req, res) => {
  const trainer = new Trainer(req.body);
  try {
    const newTrainer = await trainer.save();
    res.status(201).json(newTrainer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  let mobileNumber = req.body.mobileNumber;
  let trainer = await Trainer.findOne({ mobileNumber: mobileNumber });
  if (trainer == null) {
    console.log(trainer);
    return res.status(403).json({
      message: "user not found",
      tips: "navigate to signup page",
    });
  }

  jwt.sign({ user: trainer }, "mykey", (error, token) => {
    if (error) return res.json({ message: error.message });
    res.json({
      token,
    });
  });
});

// get one trainer with id
router.post("/get", verifyToken, async (req, res) => {
  console.log(req.user);
  res.status(200).json(req.user);
});

// available trainer
router.get("/available/trainers", async (req, res) => {
  let trainerObjectId = await Batch.find(req.body).distinct("trainerId");
  let trainerId = trainerObjectId.map((item) => `${item["_id"]}`);
  const allTrainers = await Trainer.find();
  let availabelTrainers = allTrainers.filter((item) => {
    return !trainerId.includes(`${item._id}`);
  });

  res.status(200).json(availabelTrainers);
});

// delete trainer
router.delete("/:trainerId", trainerMiddelware, async (req, res) => {
  try {
    await res.trainer.remove();
    res.json({ message: `Deleted ${res.trainer.trainerName} successfuly....` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update Trainer
router.patch("/:trainerId", trainerMiddelware, async (req, res) => {
  if (req.body.trainerName != null) {
    res.trainer.trainerName = req.body.trainerName;
  }
  if (req.body.email != null) {
    res.trainer.email = req.body.email;
  }
  if (req.body.mobileNumber != null) {
    res.trainer.mobileNumber = req.body.mobileNumber;
  }

  try {
    const updatedTrainer = await res.trainer.save();
    res.json(updatedTrainer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// middelware
async function trainerMiddelware(req, res, next) {
  let trainer;
  try {
    trainer = await Trainer.findById(req.params.trainerId);
    if (trainer == null) {
      return res.status(404).json({ message: "Can't find trainer" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.trainer = trainer;
  next();
}

module.exports = router;
