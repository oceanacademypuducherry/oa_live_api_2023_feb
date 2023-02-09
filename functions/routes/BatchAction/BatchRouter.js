const express = require("express");
const mongoose = require("mongoose");
const Batch = require("../../model/Batch");
const BatchStudent = require("../../model/BatchStudent");
const Purchase = require("../../model/Purchase");
const User = require("../../model/User");
const Trainer = require("../../model/Trainer");

const router = express.Router();

router.get("/", async (req, res) => {
  res.status(200).json({ test: "test" });
});

module.exports = router;
