const crypto       = require("crypto");
const ls           = require("../lib/lemonsqueezy");
const Creator      = require("../models/Creator");
const Subscription = require("../models/Subscription");
const Tip          = require("../models/Tip");
const { ENV }      = require("../lib/env");

// ─── Checkout abonnement ────────────────────────────────────────
const createSubscriptionCheckout = async (req, res) => {
  try {
    const { creatorId } = req.params;
    const subscriberId  = req.user._id.toString();

    if (subscriberId === creatorId)
      return res.status(400).json({ message: "Tu ne peux pas t'abonner à toi-même" });

    const creator = await Creator.findOne({ userId: creatorId });
    if (!creator) return res.status(404).json({ message: "Créateur introuvable" });

    if (!creator.lsVariantId)
      return res.status(400).json({ message: "Ce créateur n'a pas encore configuré son abonnement" });

    if (await Subscription.findOne({ subscriberId, creatorId, status: "active" }))
      return res.status(400).json({ message: "Tu es déjà abonné" });

    // Créer une session checkout LemonSqueezy
    const checkoutRes = await ls.post("/checkouts", {
      data: {
        type: "checkouts",
        attributes: {
          checkout_options: { button_color: "#7c3aed" },
          checkout_data: {
            custom: {
              subscriber_id: subscriberId,
              creator_id:    creatorId,
              type:          "subscription",
            },
          },
          product_options: {
            redirect_url: `${ENV.CLIENT_URL}/creator/${creatorId}?subscribed=true`,
          },
          expires_at: null,
        },
        relationships: {
          store:   { data: { type: "stores",   id: ENV.LEMONSQUEEZY_STORE_ID } },
          variant: { data: { type: "variants", id: creator.lsVariantId } },
        },
      },
    });

    const checkoutUrl = checkoutRes.data.data.attributes.url;
    res.status(200).json({ url: checkoutUrl });
  } catch (err) {
    console.error("createSubscriptionCheckout:", err.response?.data || err.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ─── Checkout tip ───────────────────────────────────────────────
const createTip = async (req, res) => {
  try {
    const { creatorId }   = req.params;
    const { amount, message } = req.body;
    const fromUserId      = req.user._id.toString();

    const tipAmount = parseFloat(amount);
    if (!tipAmount || tipAmount < 1)
      return res.status(400).json({ message: "Tip minimum : $1" });

    if (!await Creator.findOne({ userId: creatorId }))
      return res.status(404).json({ message: "Créateur introuvable" });

    const amountInCents = Math.round(tipAmount * 100);

    // On utilise le variant "tip" pré-créé avec custom_price
    const checkoutRes = await ls.post("/checkouts", {
      data: {
        type: "checkouts",
        attributes: {
          custom_price: amountInCents,
          checkout_options: { button_color: "#7c3aed" },
          checkout_data: {
            custom: {
              from_user_id:   fromUserId,
              to_creator_id:  creatorId,
              type:           "tip",
              message:        message || "",
            },
          },
          product_options: {
            redirect_url: `${ENV.CLIENT_URL}/creator/${creatorId}?tipped=true`,
          },
        },
        relationships: {
          store:   { data: { type: "stores",   id: ENV.LEMONSQUEEZY_STORE_ID } },
          variant: { data: { type: "variants", id: ENV.LEMONSQUEEZY_TIP_VARIANT_ID } },
        },
      },
    });

    const checkoutUrl = checkoutRes.data.data.attributes.url;

    // Sauvegarder le tip en "pending"
    await Tip.create({
      fromUserId,
      toCreatorId: creatorId,
      amount:      amountInCents,
      message:     message || "",
      status:      "pending",
    });

    res.status(200).json({ url: checkoutUrl });
  } catch (err) {
    console.error("createTip:", err.response?.data || err.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ─── Webhook LemonSqueezy ───────────────────────────────────────
const handleWebhook = async (req, res) => {
  try {
    // Vérifier la signature
    const secret    = ENV.LEMONSQUEEZY_WEBHOOK_SECRET;
    const signature = req.headers["x-signature"];
    const hmac      = crypto.createHmac("sha256", secret);
    hmac.update(req.body); // req.body est un Buffer (raw)
    const digest    = hmac.digest("hex");

    if (digest !== signature)
      return res.status(401).json({ message: "Signature invalide" });

    const payload    = JSON.parse(req.body.toString());
    const eventName  = payload.meta?.event_name;
    const customData = payload.meta?.custom_data || {};
    const data       = payload.data?.attributes || {};

    switch (eventName) {

      // Abonnement créé ou mis à jour
      case "subscription_created":
      case "subscription_updated": {
        const { subscriber_id, creator_id } = customData;
        if (!subscriber_id || !creator_id) break;

        await Subscription.findOneAndUpdate(
          { subscriberId: subscriber_id, creatorId: creator_id },
          {
            subscriberId:     subscriber_id,
            creatorId:        creator_id,
            lsSubscriptionId: payload.data?.id,
            lsCustomerId:     data.customer_id?.toString() || "",
            status:           data.status === "active" ? "active" : data.status,
            currentPeriodEnd: data.renews_at ? new Date(data.renews_at) : null,
          },
          { upsert: true, new: true }
        );
        break;
      }

      // Abonnement annulé ou expiré
      case "subscription_cancelled":
      case "subscription_expired": {
        const lsSubId = payload.data?.id;
        if (!lsSubId) break;

        await Subscription.findOneAndUpdate(
          { lsSubscriptionId: lsSubId },
          { status: eventName === "subscription_cancelled" ? "cancelled" : "expired" }
        );
        break;
      }

      // Paiement one-time (tip)
      case "order_created": {
        const { from_user_id, to_creator_id, type, message } = customData;
        if (type !== "tip" || !from_user_id || !to_creator_id) break;

        const amountCents = data.total || 0;

        await Tip.findOneAndUpdate(
          { fromUserId: from_user_id, toCreatorId: to_creator_id, status: "pending" },
          {
            lsOrderId: payload.data?.id,
            amount:    amountCents,
            message:   message || "",
            status:    "succeeded",
          },
          { sort: { createdAt: -1 } }
        );
        break;
      }

      default:
        break;
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("handleWebhook:", err);
    res.status(500).json({ message: "Erreur webhook" });
  }
};

// ─── Mes abonnements actifs ─────────────────────────────────────
const getMySubscriptions = async (req, res) => {
  try {
    const subs = await Subscription.find({
      subscriberId: req.user._id,
      status: "active",
    }).populate("creatorId", "fullName profilePic");

    res.status(200).json(subs);
  } catch (err) {
    console.error("getMySubscriptions:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ─── Annuler un abonnement ──────────────────────────────────────
const cancelSubscription = async (req, res) => {
  try {
    const { creatorId } = req.params;
    const sub = await Subscription.findOne({
      subscriberId: req.user._id,
      creatorId,
      status: "active",
    });

    if (!sub) return res.status(404).json({ message: "Abonnement introuvable" });

    // Annuler via LemonSqueezy API
    await ls.delete(`/subscriptions/${sub.lsSubscriptionId}`);

    sub.status = "cancelled";
    await sub.save();

    res.status(200).json({ message: "Abonnement annulé" });
  } catch (err) {
    console.error("cancelSubscription:", err.response?.data || err.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  createSubscriptionCheckout,
  createTip,
  handleWebhook,
  getMySubscriptions,
  cancelSubscription,
};