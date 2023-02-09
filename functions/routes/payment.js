const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");

let razorpay = new Razorpay({
  key_id: "rzp_test_V5lYmgTFReqwlV",
  key_secret: "k9efFY1DIgmjLDwHNrgdNDNj",
});

router.post("/order", async (req, res) => {
  const reciptId = "OA_" + Math.random().toPrecision().substring(2);
  const options = {
    amount: req.body.amount,
    currency: "INR",
    receipt: reciptId, //any unique ID
    payment_capture: 1, //optional
  };
  try {
    const response = await razorpay.orders.create(options);
    res.json({
      order_id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Unable to create order");
  }
});

module.exports = router;
