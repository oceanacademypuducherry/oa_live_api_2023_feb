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
  try {
    if (studentId == null) throw Error("student ID required");

    if (certificateUrl == null) throw Error("certificate path required");

    const isId = await Certificate.findOne({ studentId: studentId });
    if (isId != null) {
      throw Error("certificate already exist");
    }
    const cert = new Certificate({
      studentId: studentId,
      certificateUrl: certificateUrl,
    });
    cert.save();

    res.status(200).json(cert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update certificate
router.post("/update/:studentId", verifyToken, async (req, res) => {
  const studentId = req.params.studentId;
  const certificateUrl = req.body.certificateUrl;
  try {
    if (studentId == null) throw Error("student ID required");

    if (certificateUrl == null) throw Error("certificate path required");

    const result = await Certificate.updateOne(
      { studentId: studentId },
      { certificateUrl: certificateUrl }
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
