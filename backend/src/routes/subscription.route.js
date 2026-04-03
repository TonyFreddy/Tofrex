const express = require("express");
const {
  createSubscriptionCheckout,
  createTip,
  handleWebhook,
  getMySubscriptions,
  cancelSubscription,
} = require("../controllers/subscription.controller");
const { protectRoute }     = require("../middleware/auth.middleware");
const { arcjetProtection } = require("../middleware/arcjet.middleware");

const router = express.Router();

// ⚠️ Webhook AVANT les middlewares — body doit rester raw
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

router.use(arcjetProtection, protectRoute);

router.post("/subscribe/:creatorId", createSubscriptionCheckout);
router.post("/tip/:creatorId",       createTip);
router.get("/my",                    getMySubscriptions);
router.delete("/cancel/:creatorId",  cancelSubscription);

module.exports = router;