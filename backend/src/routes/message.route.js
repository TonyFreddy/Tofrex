const express = require("express");
const { getAllContacts, getChatPartners, getMessagesByUserId, sendMessage } = require("../controllers/message.controller");
const { protectRoute } = require("../middleware/auth.middleware");
const { arcjetProtection } = require("../middleware/arcjet.middleware");

const router = express.Router();

router.use(arcjetProtection, protectRoute);
router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.get("/:id", getMessagesByUserId);
router.post("/send/:id", sendMessage);

module.exports = router;