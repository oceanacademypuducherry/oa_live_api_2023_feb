const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Admin = require("../../model/Admin");
const verifyToken = require("../../verifyToken");

router.post("/", verifyToken, async (req, res) => {
  try {
    const isAdmin = await Admin.findById(req.user["_id"]);

    if (isAdmin == null)
      return res.status(400).json({ message: "admin not found" });

    res.json(req.user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/login", async (req, res) => {
  let mobileNumber = req.body.mobileNumber;
  let adminId = await Admin.findOne({ mobileNumber: mobileNumber });
  if (adminId == null) {
    return res.status(403).json({
      message: "user not found",
      tips: "navigate to signup page",
    });
  }
  jwt.sign({ user: adminId }, "mykey", (error, token) => {
    if (error) return res.json({ message: error.message });
    res.json({
      token,
    });
  });
});

router.post("/create", async (req, res) => {
  try {
    const newAdmin = await Admin(req.body);

    newAdmin.save();
    jwt.sign({ user: newAdmin }, "mykey", (error, token) => {
      if (error) return res.json({ message: error.message });
      res.status(201).json({
        token: token,
        user: newAdmin,
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// router.post("/login", (req, res) => {});
module.exports = router;
