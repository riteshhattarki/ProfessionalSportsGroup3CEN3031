const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

// checks the token on the request and saves the user id for the route to use
function requireLogin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "please log in first" });
  }

  try {
    const data = jwt.verify(token, SECRET);
    req.userId = data.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "your login is not valid" });
  }
}

function makeToken(userId) {
  return jwt.sign({ userId: userId }, SECRET, { expiresIn: "7d" });
}

module.exports = { requireLogin, makeToken };
