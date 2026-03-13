const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
  },
});

const keysDir = path.join(__dirname, "keys");

// Create keys directory if it doesn't exist
if (!fs.existsSync(keysDir)) {
  fs.mkdirSync(keysDir);
}

// Write public key
fs.writeFileSync(path.join(keysDir, "public.pem"), publicKey);
console.log("Public key generated: keys/public.pem");

// Write private key
fs.writeFileSync(path.join(keysDir, "private.pem"), privateKey);
console.log("Private key generated: keys/private.pem");

console.log("✓ RSA key pair generated successfully for RS256 JWT");
