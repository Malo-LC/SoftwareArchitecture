const jwt = require("jsonwebtoken");

const createToken = (user) => {
  try {
    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

    return token;
  } catch (error) {
    console.error(`Unable to create token for user "${user.email}":`, error);
    return null;
  }
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error(`Unable to verify token "${token}":`, error);
    return null;
  }
};

module.exports = { createToken, verifyToken };
