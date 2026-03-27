const express = require('express');

const router = express.Router();



router.get("/send", (req, res) => {
    res.send("Send message endpoint");
});


module.exports = router;