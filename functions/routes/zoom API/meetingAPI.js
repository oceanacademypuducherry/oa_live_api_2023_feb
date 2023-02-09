const express = require("express");
const router = express.Router();
//include required modules
const jwt = require("jsonwebtoken");
const config = require("./config");
const rp = require("request-promise");

const makeSign = require("./signature");

var email;
//Use the ApiKey and APISecret from config.js
const payload = {
  iss: config.APIKey,
  exp: new Date().getTime() + 5000,
};

const token = jwt.sign(payload, config.APISecret);

// Schedule batch
router.post("/meeting", async (req, res) => {
  email = req.body.email;
  var options = {
    method: "POST",
    uri: "https://api.zoom.us/v2/users/" + email + "/meetings",
    body: {
      topic: "Meeting",
      type: 1,
      settings: {
        host_video: "true",
        participant_video: "true",
      },
    },

    auth: {
      bearer: token,
    },
    headers: {
      "User-Agent": "Zoom-api-Jwt-Request",
      "content-type": "application/json",
    },
    json: true, //Parse the JSON string in the response
  };
  rp(options)
    .then(function (response) {
      console.log(response);
      let dataRes = {
        // base_join_url: response.join_url,

        join_url: `https://oa-live-classroom.web.app?/mn=${response.id}?pwd=${
          response.encrypted_password
        }?role=${0}?name=`,
        // join_url_local: `http://127.0.0.1:9999/index.html?/mn=${
        //   response.id
        // }?pwd=${response.encrypted_password}?role=${0}?name=test`,
      };
      res.status(200).json(dataRes);
      res.send("create meeting result: " + JSON.stringify(response));
    })
    .catch(function (err) {
      console.log("error", err.message);
    });
});

// ! not using => if we want use webinars we should subscribe for zoom webinar
router.post("/webinar/create", async (req, res) => {
  let options = {
    method: "POST",
    uri: "https://api.zoom.us/v2/users/oceanacademypuducherry@gmail.com/webinars",
    body: {
      agenda: "My Webinar",
      duration: 60,
      password: "123456",
      topic: "My Webinar",
      type: 5,
      settings: {
        host_video: "true",
        participant_video: "true",
      },
    },
    auth: {
      bearer: token,
    },
    headers: {
      "User-Agent": "Zoom-api-Jwt-Request",
      "content-type": "application/json",
    },
    json: true, //Parse the JSON string in the response
  };
  rp(options)
    .then(function (response) {
      console.log(response);

      res.status(200).json([]);

      // res.send("create meeting result: " + JSON.stringify(response));
    })
    .catch(function (error) {
      console.log("error", error.message);
    });
});
module.exports = router;
