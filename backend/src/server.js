const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require("./routes/auth.route");
const messageRoutes = require("./routes/message.route");


dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000

app.use("/api/auth" , authRoutes);
app.use("/api/message" , messageRoutes);



app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));