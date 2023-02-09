const express = require("express");
const res = require("express/lib/response");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const User = require("../../model/User");
const verifyToken = require("../../verifyToken");

// get all users
router.get("/all", async (req, res) => {
  try {
    const allUser = await User.find();
    res.json(allUser);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  let mobileNumber = req.body.mobileNumber;
  let userId = await User.findOne({ mobileNumber: mobileNumber });
  if (userId == null) {
    console.log(userId);
    return res.status(403).json({
      message: "user not found",
      tips: "navigate to signup page",
    });
  }

  jwt.sign({ user: userId }, "mykey", (error, token) => {
    if (error) return res.json({ message: error.message });
    res.json({
      token,
    });
  });
});

// create user
router.post("/create", async (req, res) => {
  const user = new User(req.body);
  if (user.firstName == null)
    res.status(400).json({ message: "firstName is require" });
  if (user.email == null) res.status(400).json({ message: "email is require" });
  if (user.mobileNumber == null)
    res.status(400).json({ message: "mobileNumber is require" });
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ! not user : get one user with id
router.post("/", verifyToken, getUserWithId, async (req, res) => {
  res.status(200).json(res.user);
});

// delete user
router.delete("/", verifyToken, getUserWithId, async (req, res) => {
  try {
    await res.user.remove();
    res.json({ message: `Deleted ${res.user.firstName} successfuly....` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update user
router.patch("/", verifyToken, getUserWithId, async (req, res) => {
  if (req.body.firstName != null) {
    res.user.firstName = req.body.firstName;
  }
  if (req.body.email != null) {
    res.user.email = req.body.email;
  }
  if (req.body.mobileNumber != null) {
    res.user.mobileNumber = req.body.mobileNumber;
  }
  if (req.body.gender != null) {
    res.user.gender = req.body.gender;
  }
  if (req.body.dateOfBirth != null) {
    res.user.dateOfBirth = Date.parse(req.body.dateOfBirth);
  }
  if (req.body.occupation != null) {
    res.user.occupation = req.body.occupation;
  }
  if (req.body.lastName != null) {
    res.user.lastName = req.body.lastName;
  }
  if (req.body.instOrOrg != null) {
    res.user.instOrOrg = req.body.instOrOrg;
  }
  if (req.body.state != null) {
    res.user.state = req.body.state;
  }
  if (req.body.country != null) {
    res.user.country = req.body.country;
  }
  if (req.body.profilePicture != null) {
    res.user.profilePicture = req.body.profilePicture;
  }
  // res.user.updatedDate = Date.now();

  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// middelware
async function getUserWithId(req, res, next) {
  let user;
  try {
    user = await User.findById(req.user);
    if (user == null) {
      return res.status(404).json({ message: "Can't find User" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.user = user;
  next();
}

module.exports = router;
