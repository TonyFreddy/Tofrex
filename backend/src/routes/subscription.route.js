const express = require("express");
const {
  verifySubscription, verifyTip,
  getMySubscriptions, cancelSubscription,
} = require("../controllers/subscription.controller");
const { protectRoute }     = require("../middleware/auth.middleware");
const { arcjetProtection } = require("../middleware/arcjet.middleware");

const router = express.Router();
router.use(arcjetProtection, protectRoute);

router.post("/subscribe/:creatorId",  verifySubscription);
router.post("/tip/:creatorId",        verifyTip);
router.get("/my",                     getMySubscriptions);
router.delete("/cancel/:creatorId",   cancelSubscription);

module.exports = router;