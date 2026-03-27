const aj = require("../lib/arcjet");
const { isSpoofedBot } = require("@arcjet/inspect");

const arcjetProtection = async (req, res, next) => {
  try {
    const decision = await aj.protect(req);
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ message: "Rate limit exceeded." });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({ message: "Bot access denied." });
      } else {
        return res.status(403).json({ message: "Access denied." });
      }
    }
    if (decision.results.some(isSpoofedBot)) {
      return res.status(403).json({ message: "Malicious bot detected." });
    }
    next();
  } catch (error) {
    console.log("Arcjet error:", error);
    next();
  }
};

module.exports = { arcjetProtection };