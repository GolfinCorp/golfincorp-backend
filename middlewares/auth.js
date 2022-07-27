jwt = require("jsonwebtoken");

const tokenValidate = (req, res, next) => {
	const authToken = req.headers["authorization"];
	if (authToken == null) return res.sendStatus(401);
	jwt.verify(authToken, process.env.JWT_SECRET, (err, user) => {
		if (err) return res.sendStatus(403);
		req.user = user;
		next();
	});
};

const generateAccessToken = (user) => {
	return jwt.sign(user, process.env.JWT_SECRET);
};

module.exports = { tokenValidate, generateAccessToken };
