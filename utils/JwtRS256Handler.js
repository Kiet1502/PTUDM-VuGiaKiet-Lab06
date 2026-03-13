const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

// Load RSA keys
const privateKey = fs.readFileSync(
  path.join(__dirname, "../keys/private.pem"),
  "utf8",
);
const publicKey = fs.readFileSync(
  path.join(__dirname, "../keys/public.pem"),
  "utf8",
);

module.exports = {
  // Generate JWT with RS256 algorithm
  GenerateToken: function (payload) {
    return jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "30d",
    });
  },

  // Verify JWT with RS256 algorithm
  VerifyToken: function (token) {
    try {
      return jwt.verify(token, publicKey, {
        algorithm: ["RS256"],
      });
    } catch (error) {
      throw error;
    }
  },
};
