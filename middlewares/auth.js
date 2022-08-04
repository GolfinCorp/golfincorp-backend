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

const requireAdmin = (req, res, next) => {
	const { user } = req;
	if (user.role !== "admin") {
		return res.status(401).send({ error: "Admin rights are required" });
	}
	next();
};

module.exports = { tokenValidate, generateAccessToken, requireAdmin };
