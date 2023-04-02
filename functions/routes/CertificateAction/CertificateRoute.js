const express = require("express");
const Certificate = require("../../model/Certificate");
const router = express.Router();

const verifyToken = require("../../verifyToken");

// get all certificate

router.post("/get/all", verifyToken, async (req, res) => {
  try {
    const cert = await Certificate.find();

    res.status(200).json(cert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get certificate
router.get("/get/:studentId", async (req, res) => {
  const studentId = req.params.studentId;
  try {
    const cert = await Certificate.findOne({ studentId: studentId });

    res.status(200).json(cert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// add certificate
router.post("/add", verifyToken, async (req, res) => {
  const studentId = req.body.studentId;
  const certificateUrl = req.body.certificateUrl;
  const certificateEarned = req.body.certificateEarned;
  const courseCompleted = req.body.courseCompleted;
  const studentName = req.body.studentName;
  const studentProfile = req.body.studentProfile;
  const learnedSkills = req.body.learnedSkills;
  try {
    if (!Boolean(studentId)) throw Error("student ID required");
    if (!Boolean(certificateUrl)) throw Error("certificate path required");
    if (!Boolean(studentName)) throw Error("Student Name required");
    if (!Boolean(courseCompleted))
      throw Error("Course Completed field required");
    if (!Boolean(certificateEarned))
      throw Error("Certificate Earned field required");

    const isId = await Certificate.findOne({ studentId: studentId });
    if (isId != null) {
      throw Error("certificate already exist");
    }
    const cert = new Certificate({
      studentId: studentId,
      certificateUrl: certificateUrl,
      certificateEarned: certificateEarned,
      courseCompleted: courseCompleted,
      studentName: studentName,
      studentProfile: studentProfile,
      learnedSkills: learnedSkills,
    });

    cert.save();

    res.status(200).json(cert);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// update certificate
router.post("/update/:certDocId", verifyToken, async (req, res) => {
  const certDocId = req.params.certDocId;
  const studentId = req.body.studentId;
  const certificateUrl = req.body.certificateUrl;
  const studentProfile = req.body.studentProfile;
  const studentName = req.body.studentName;
  const courseCompleted = req.body.courseCompleted;
  const certificateEarned = req.body.certificateEarned;
  const learnedSkills = req.body.learnedSkills;
  try {
    if (!Boolean(certDocId)) throw Error("Collection ID required");
    if (!Boolean(studentId)) throw Error("student ID required");
    if (!Boolean(certificateUrl)) throw Error("certificate path required");
    if (!Boolean(studentName)) throw Error("Student Name required");
    if (!Boolean(courseCompleted))
      throw Error("Course Completed field required");
    if (!Boolean(certificateEarned))
      throw Error("Certificate Earned field required");

    const result = await Certificate.updateOne(
      { _id: certDocId },
      {
        studentId: studentId,
        certificateUrl: certificateUrl,
        studentProfile: studentProfile,
        studentName: studentName,
        courseCompleted: courseCompleted,
        certificateEarned: certificateEarned,
        learnedSkills: learnedSkills,
      }
    );

    res.status(200).json({ result: result, message: "update succesfuly..." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// delete certificate
router.post("/delete/:studentId", verifyToken, async (req, res) => {
  const studentId = req.params.studentId;

  try {
    if (studentId == null) throw Error("student ID required");

    const result = await Certificate.deleteOne({ studentId: studentId });

    res.status(200).json({ result: result, message: "delete succesfuly..." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
