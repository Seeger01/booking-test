const jwt = require("jsonwebtoken");

module.exports = (reg, res, next) => {
	const authHeader = reg.get("Authorization");
	if (!authHeader) {
		reg.isAuth = false;
		return next();
	}
	const token = authHeader.split(" ")[1];
	if (!token || token === "") {
		reg.isAuth = false;
		return next();
	}
	let decodedToken;
	try {
		decodedToken = jwt.verify(token, "supersecretkey");
	} catch (err) {
		reg.isAuth = false;
		return next();
	}
	if (!decodedToken) {
		reg.isAuth = false;
		return next();
	}
	reg.isAuth = true;
	reg.userId = decodedToken.userId;
	next();
};
