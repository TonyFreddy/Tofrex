const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  ENV: {
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || "development"
  }
};