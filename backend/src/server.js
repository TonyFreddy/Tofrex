const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

console.log(process.env.PORT);

app.get("/api/auth/signup", (req, res) => {
    res.send("Signup endpoint");
});

app.get("/api/auth/login", (req, res) => {
    res.send("Login endpoint");
});

app.get("/api/auth/logout", (req, res) => {
    res.send("Logout endpoint");
});

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));