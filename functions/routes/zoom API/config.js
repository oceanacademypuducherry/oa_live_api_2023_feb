const env = process.env.NODE_ENV || "production";

//insert your API Key & Secret for each environment, keep this file local and never push it to a public repo for security purposes.
const config = {
  development: {
    APIKey: "",
    APISecret: "",
  },
  production: {
    APIKey: "pTz8YdzeQ1ORDdBDrnymSw",
    APISecret: "FFU0PQ8dAdjoaY0AELcVoss8Df5O5MJO09Wn",
  },
};

module.exports = config[env];
