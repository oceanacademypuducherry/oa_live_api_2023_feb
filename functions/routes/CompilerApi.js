const axios = require("axios");

const compilerApi = async (req, res) => {
  axios
    .post("https://api.jdoodle.com/v1/execute", req.body)
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      res.json({ message: error.message, error: "sorry!, Somthig went wrong" });
    });
};

module.exports = compilerApi;
