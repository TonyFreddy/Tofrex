const mongoose = require("mongoose");
const { ENV } = require("./env");

const connectDB = async () => {
  try {
    if (!ENV.MONGO_URI) throw new Error("MONGO_URI is not set");
    const conn = await mongoose.connect(ENV.MONGO_URI);
    console.log("MongoDB connected:", conn.connection.host);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = { connectDB };