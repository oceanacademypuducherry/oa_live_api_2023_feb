const express = require("express");
const router = express.Router();
const verifyToken = require("../../verifyToken");
const SubscribedUser = require("../../model/SubscribedUser");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "oceanacademypuducherry@gmail.com",
    pass: "kndyaofbgwibspus", //smtp Password
  },
});

// get subscribe list
router.get("/", async (req, res) => {
  const subscribedUser = await SubscribedUser.find();
  res.status(200).json(subscribedUser);
});

// subscribe
router.post("/add", async (req, res) => {
  try {
    const mailOptions = {
      from: "oceanacademypuducherry@gmail.com",
      to: req.body.email,
      subject: "Welcome to Ocean Academy",
      text: "Hi There!\n\tWelcome to Ocean Academy",
    };

    const subscribedUser = await SubscribedUser.create(req.body);
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error, "error");
      } else {
        console.log(info, "info");
      }
    });
    res.status(201).json(subscribedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
