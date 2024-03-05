const jwt = require("jsonwebtoken");

const { createNewToken } = require('../database/token');

const createToken = (user) => {
  try {
    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
    createNewToken(user, token, life_time = 86400);

    return token;
  } catch (error) {
    console.error(`Unable to create token for user "${user.email}":`, error);
    return null;
  }
}

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error(`Unable to verify token "${token}":`, error);
    return null;
  }
}

module.exports = { createToken, verifyToken };