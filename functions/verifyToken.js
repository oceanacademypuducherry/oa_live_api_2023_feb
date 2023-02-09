const jwt = require("jsonwebtoken");

async function verifyToken(req, res, next) {
  // const authHeader = req.headers["authorization"];
  const token = await req.body.token;

  if (token == null) return res.sendStatus(401);
  jwt.verify(token, "mykey", (error, user) => {
    if (error) return res.sendStatus(403);
    req.user = user.user;

    next();
  });
}

module.exports = verifyToken;
