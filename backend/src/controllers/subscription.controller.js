const { verifyTransaction } = require("../lib/kkiapay");
const Creator      = require("../models/Creator");
const Subscription = require("../models/Subscription");
const Tip          = require("../models/Tip");
const Notification = require("../models/Notification");
const User         = require("../models/User");

// ─── Vérifier paiement abonnement ──────────────────
const verifySubscription = async (req, res) => {
  try {
    const { creatorId }     = req.params;
    const { transactionId } = req.body;
    const subscriberId      = req.user._id;

    if (!transactionId)
      return res.status(400).json({ message: "transactionId requis" });

    if (subscriberId.toString() === creatorId)
      return res.status(400).json({ message: "Tu ne peux pas t'abonner à toi-même" });

    const creator = await Creator.findOne({ userId: creatorId });
    if (!creator) return res.status(404).json({ message: "Créateur introuvable" });

    // Vérifier la transaction avec KKiaPay
    const transaction = await verifyTransaction(transactionId);
    if (transaction.status !== "SUCCESS")
      return res.status(400).json({ message: "Paiement non confirmé" });

    // Expiration dans 30 jours
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Désactiver l'ancien abonnement si existant
    await Subscription.findOneAndUpdate(
      { subscriberId, creatorId },
      { status: "expired" }
    );

    const sub = await Subscription.create({
      subscriberId,
      creatorId,
      transactionId,
      amount:    transaction.amount,
      status:    "active",
      expiresAt,
    });

    // Mettre à jour les gains du créateur
    await Creator.findOneAndUpdate({ userId: creatorId }, { $inc: { totalEarned: transaction.amount } });

    // Notification au créateur
    const subscriber = await User.findById(subscriberId);
    await Notification.create({
      userId:  creatorId,
      type:    "subscription",
      fromId:  subscriberId,
      message: `${subscriber.fullName} s'est abonné à toi`,
    });

    res.status(200).json({ message: "Abonnement activé !", subscription: sub });
  } catch (err) {
    console.error("verifySubscription:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ─── Vérifier paiement tip ──────────────────────────
const verifyTip = async (req, res) => {
  try {
    const { creatorId }          = req.params;
    const { transactionId, message } = req.body;
    const fromUserId             = req.user._id;

    if (!transactionId)
      return res.status(400).json({ message: "transactionId requis" });

    const transaction = await verifyTransaction(transactionId);
    if (transaction.status !== "SUCCESS")
      return res.status(400).json({ message: "Paiement non confirmé" });

    const tip = await Tip.create({
      fromUserId,
      toCreatorId: creatorId,
      amount:      transaction.amount,
      transactionId,
      message:     message || "",
      status:      "succeeded",
    });

    await Creator.findOneAndUpdate({ userId: creatorId }, { $inc: { totalEarned: transaction.amount } });

    const sender = await User.findById(fromUserId);
    await Notification.create({
      userId:  creatorId,
      type:    "tip",
      fromId:  fromUserId,
      message: `${sender.fullName} t'a envoyé un tip de ${transaction.amount} XOF`,
    });

    res.status(200).json({ message: "Tip envoyé !", tip });
  } catch (err) {
    console.error("verifyTip:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ─── Mes abonnements ────────────────────────────────
const getMySubscriptions = async (req, res) => {
  try {
    const now  = new Date();
    const subs = await Subscription.find({
      subscriberId: req.user._id,
      status: "active",
      expiresAt: { $gt: now },
    }).populate({ path: "creatorId", select: "fullName profilePic", model: "User" });

    res.status(200).json(subs);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ─── Annuler abonnement ─────────────────────────────
const cancelSubscription = async (req, res) => {
  try {
    const { creatorId } = req.params;
    const sub = await Subscription.findOne({
      subscriberId: req.user._id,
      creatorId,
      status: "active",
    });
    if (!sub) return res.status(404).json({ message: "Abonnement introuvable" });

    sub.status = "cancelled";
    await sub.save();
    res.status(200).json({ message: "Abonnement annulé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = { verifySubscription, verifyTip, getMySubscriptions, cancelSubscription };