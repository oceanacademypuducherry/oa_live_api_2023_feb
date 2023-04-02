const express = require("express");
const router = express.Router();
const AlertEnquiry = require("../model/AlertEnquiry");
const nodemailer = require("nodemailer");
const fs = require("fs");

// mail auth config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "oceanacademypuducherry@gmail.com",
    pass: "qwqokbolvyhunufr", //smtp Password
  },
});

router.post("/", async (req, res) => {
  const { name, mobileNumber, email, selectedCoruse, description } = req.body;
  let htmlData;
  try {
    fs.readFile("./mailTemplate.html", "utf-8", function (error, data) {
      if (error) {
        console.log(error);
      } else {
        htmlData = data;
        console.log(htmlData);
        const mailingOption = {
          from: "oceanacademypuducherry@gmail.com",
          to: [
            "karthikbsuccess@gmail.com",
            "brindaspringnet@gmail.com",
            "oceandocuments@gmail.com",
          ],
          // to: "thamizharasan2373@gmail.com",
          subject: "OA Website New Enquiry " + selectedCoruse,
          attachments: [
            {
              filename: "call.png",
              path: "./call.png",
              cid: "call",
            },
            {
              filename: "mail.png",
              path: "./mail.png",
              cid: "mail",
            },
            {
              filename: "logo.png",
              path: "./logo.png",
              cid: "logo",
            },
          ],
          html: htmlData
            .replaceAll("{{name}}", name)
            .replaceAll("{{email}}", email)
            .replaceAll("{{mobileNumber}}", mobileNumber)
            .replaceAll("{{selectedCoruse}}", selectedCoruse)
            .replaceAll("{{description}}", description)
            .replaceAll("{{chr}}", name[0].toUpperCase()),
        };
        console.log(htmlData);
        transporter.sendMail(mailingOption, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log(info, "info........");
          }
        });
      }
    });
    let querydata = await AlertEnquiry(req.body);
    await querydata.save();
    res.json(querydata);
  } catch (e) {
    res.json({ error: e.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    let allEnquiry = await AlertEnquiry.find();
    res.json(allEnquiry);
  } catch (error) {
    res.json({ message: error.message });
  }
});

router.post("/delete/:docId", async (req, res) => {
  const docId = req.params.docId;
  try {
    await AlertEnquiry.deleteOne({ _id: docId });
    res.json({ message: "deleted successfuly..." });
  } catch (error) {
    res.json({ message: error.message });
  }
});
module.exports = router;
