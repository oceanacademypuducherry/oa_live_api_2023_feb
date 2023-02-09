const jwt = require("jsonwebtoken");
const config = require("./zoom API/config");
const rp = require("request-promise");

const payload = {
  iss: config.APIKey,
  exp: new Date().getTime() + 5000,
};

const token = jwt.sign(payload, config.APISecret);
async function meetingCreater(
  email = "oceanacademypuducherry@gmail.com",
  topic = "OA Meeting"
) {
  var options = {
    method: "POST",
    uri: "https://api.zoom.us/v2/users/" + email + "/meetings",
    body: {
      topic: topic,
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
  try {
    const response = await rp(options);
    if (response) {
      let dataRes = {
        join_url: `https://oa-live-classroom.web.app?/mn=${response.id}?pwd=${response.encrypted_password}?`,
        join_url_local: `http://127.0.0.1:9999/index.html?/mn=${response.id}?pwd=${response.encrypted_password}?`,
      };
      return dataRes;
    }
  } catch (error) {
    return {};
  }
}

module.exports = meetingCreater;
