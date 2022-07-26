jwt = require("jsonwebtoken");

const tokenValidate = (req, res, next) => {
  console.log(req.headers);
  const authToken = req.headers["authorization"];
  if (authToken == null) return res.sendStatus(401);
  jwt.verify(authToken, process.env.JWT_SECRET, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET);
};

module.exports = { tokenValidate, generateAccessToken };
