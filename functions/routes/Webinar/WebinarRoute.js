const express = require("express");
const mongoose = require("mongoose");
const WebinarMentor = require("../../model/WebinarMentor");
const Webinar = require("../../model/Webinar");
const WebinarUser = require("../../model/WebinarUser");
const Admin = require("../../model/Admin");
const cors = require("cors");

const verifyToken = require("../../verifyToken");
const meetingCreater = require("../zoomMeetingGenarator");
const router = express.Router();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "oceanacademypuducherry@gmail.com",
    pass: "kndyaofbgwibspus", //smtp Password
  },
});

// get all webinar
router.get("/", async (req, res) => {
  try {
    const allWebinars = await Webinar.find().populate("mentor");

    res.status(200).json(allWebinars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get all webinar mentor
router.post("/mentor/all", verifyToken, adminMiddleware, async (req, res) => {
  try {
    const allMentor = await WebinarMentor.find();
    res.status(200).json(allMentor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// add webinar mentor
router.post("/mentor/add", verifyToken, adminMiddleware, async (req, res) => {
  try {
    const webinarMentor = await WebinarMentor(req.body);
    await webinarMentor.save();
    res.status(201).json(webinarMentor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// add webinar
router.post("/add", verifyToken, adminMiddleware, async (req, res) => {
  try {
    const mentor = await WebinarMentor.findById(req.body.mentor);
    console.log(mentor);
    const date = new Date(req.body.linkDate);
    console.log(date.toUTCString());
    const dateObject = {
      day: date.getDay(),
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      date: date.getDate(),
      hours: date.getHours(),
      minutes: date.getMinutes(),
    };
    let mentorName = mentor.mentorName
      .replace(/\./g, "%2E")
      .replace(/\s/g, "%20");

    const meetingData = await meetingCreater();
    const mentorLink =
      meetingData.join_url +
      `role=${1}?name=${mentorName}?day=${dateObject.day}?year=${
        dateObject.year
      }?month=${dateObject.month}?date=${dateObject.date}?hours=${
        dateObject.hours
      }?minutes=${dateObject.minutes}`;
    const userLink =
      meetingData.join_url +
      `role=${0}?day=${dateObject.day}?year=${dateObject.year}?month=${
        dateObject.month
      }?date=${dateObject.date}?hours=${dateObject.hours}?minutes=${
        dateObject.minutes
      }?`;
    // ! date issue pending
    const webinar = await Webinar({
      ...req.body,
      mentorZoomLink: mentorLink,
      userZoomLink: userLink,
    });

    const mailOptions = {
      from: "oceanacademypuducherry@gmail.com",
      to: mentor.mentorEmail,
      subject: "Welcome to Ocean Academy",
      text:
        "Hi There!\n\tWelcome to Ocean Academy this is your join Url " +
        mentorLink,
    };

    await webinar.save();
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error, "error");
      } else {
        console.log(info, "info");

        res.status(201).json(webinar);
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//delete Wbinar
router.post("/delete", verifyToken, adminMiddleware, async (req, res) => {
  try {
    await Webinar.deleteOne({ _id: req.body.webinarId });
    await WebinarUser.deleteMany({ webinar: req.body.webinarId });
    res.status(201).json("webinar deleted");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete all webinar
router.post("/delete/all", verifyToken, async (req, res) => {
  try {
    await Webinar.deleteMany({});

    res.status(201).json("deleted all webinars");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get all upcoming webinar
router.post("/upcoming", async (req, res) => {
  let currentDate = new Date().toISOString();

  try {
    const upcomingWebinars = await Webinar.find({
      isComplete: false,
      startAt: { $gt: currentDate },
    })
      .sort({
        startAt: 1,
      })
      .populate("mentor");

    res.status(200).json(upcomingWebinars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get all completed webinar
router.post("/completed", verifyToken, adminMiddleware, async (req, res) => {
  try {
    const completedWebinar = await Webinar.find({ isComplete: true });

    res.status(200).json(completedWebinar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get  upcoming webinar with webinar id
router.get("/upcoming/:webinarId", async (req, res) => {
  try {
    const oneWebinar = await Webinar.findById(req.params.webinarId).populate(
      "mentor"
    );

    res.status(200).json(oneWebinar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//register webinar for  user
router.post("/user/add", async (req, res) => {
  const webinarId = req.body.webinar;
  let webinar = await Webinar.findById(webinarId);
  if (!webinar) {
    res.status(500).json({ message: "webinar not found" });
  }
  let endrollCount = webinar.enrolledCount;
  webinar.enrolledCount = endrollCount + 1;
  let userZoomLink = webinar.userZoomLink;
  await webinar.save();
  let userDocId = "test";

  try {
    const webinarUser = await WebinarUser(req.body);
    userDocId = `${webinarUser._id}`;
    webinarUser.zoomLink = userZoomLink + `name=${webinarUser.username}`;
    await webinarUser.save();

    const joinLink =
      "https://oceanacademy.co.in/webinar/user/join/" + userDocId;
    // const joinLinkLocal =
    //   "http://localhost:3000/webinar/user/join/" + userDocId;

    const mailOptions = {
      from: "oceanacademypuducherry@gmail.com",
      to: req.body.email,
      subject: "Welcome to Ocean Academy",
      text:
        "Hi There!\n\tWelcome to Ocean Academy this is your join Url " +
        joinLink,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error, "error");
      } else {
        console.log(info, "info");
      }
    });

    res.status(201).json({
      joinLink: joinLink,
      webinarUser: webinarUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get webinar users with webinar id
router.get("/users/:webinarId", async (req, res) => {
  try {
    const tihsWebinarUser = await WebinarUser.find({
      webinar: req.params.webinarId,
    });

    res.status(200).json(tihsWebinarUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// user join webinar
router.get("/user/join/:userId", async (req, res) => {
  try {
    const tihsWebinarUser = await WebinarUser.findOne({
      _id: req.params.userId,
    });

    res.status(200).json(tihsWebinarUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// mentor join webinar
router.get("/mentor/join/:webinarId", async (req, res) => {
  try {
    const tihsWebinarUser = await Webinar.findOne({
      _id: req.params.webinarId,
    });

    res.status(200).json(tihsWebinarUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/completed/:webinarId", async (req, res) => {
  try {
    const tihsWebinarUser = await Webinar.updateOne(
      {
        _id: req.params.webinarId,
      },
      { $set: { isComplete: req.body.isComplete } }
    );

    res.status(200).json(tihsWebinarUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get  upcoming webinar for  notification
router.get("/notification", cors(), async (req, res) => {
  let currentDate = new Date().toISOString();
  console.log(currentDate);
  try {
    const notification = await Webinar.findOne({ isComplete: false })
      .where("startAt")
      .gt(currentDate)
      .sort({ startAt: 1 });

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/fun/", async (req, res) => {
  try {
    // const mentor = await WebinarMentor.findById(req.body.mentor);
    // let mentorName = mentor.mentorName
    //   .replace(/\./g, "%2E")
    //   .replace(/\s/g, "%20");
    // // mentorName = mentorName.replace(/\s/g, "%20");
    // console.log(mentorName);
    // const meetingData = await meetingCreater();
    // const url = meetingData.join_url_local + `name=${mentorName}`;
    const date = new Date(req.body.startAt);
    console.log(date);
    const dateObject = {
      day: date.getDay(),
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      date: date.getDate(),
      hours: date.getHours(),
      minutes: date.getMinutes(),
    };

    res.json(dateObject);
  } catch (e) {
    res.json({ message: e.message });
  }
});

async function adminMiddleware(req, res, next) {
  let admin;
  try {
    admin = await Admin.findById(req.user["_id"]);

    if (admin == null)
      return res.status(400).json({ message: "admin not found" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
  res.admin = admin;
  next();
}

module.exports = router;
