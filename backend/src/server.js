const express = require('express');
const dotenv = require('dotenv');
const { connectDB } = require("./lib/db");
const path = require('path');
const authRoutes = require("./routes/auth.route");
const messageRoutes = require("./routes/message.route");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    }); 
}

app.listen(PORT, () => {
  console.log("Server running on port:", PORT);
  connectDB();
});