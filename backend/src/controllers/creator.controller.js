const Creator      = require("../models/Creator");
const Post         = require("../models/Post");
const User         = require("../models/User");
const Subscription = require("../models/Subscription");
const Notification = require("../models/Notification");
const cloudinary   = require("../lib/cloudinary");

// ─── Devenir créateur ───────────────────────────────
const becomeCreator = async (req, res) => {
  try {
    const { bio, monthlyPrice } = req.body;
    const userId = req.user._id;

    if (await Creator.findOne({ userId }))
      return res.status(400).json({ message: "Tu es déjà créateur" });

    const price = parseInt(monthlyPrice);
    if (!price || price < 500)
      return res.status(400).json({ message: "Prix minimum : 500 XOF/mois" });

    await Creator.create({ userId, bio: bio || "", monthlyPrice: price });
    await User.findByIdAndUpdate(userId, { isCreator: true });

    const updated = await User.findById(userId).select("-password");
    res.status(201).json({ message: "Profil créateur activé !", user: updated });
  } catch (err) {
    console.error("becomeCreator:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ─── Tous les créateurs ─────────────────────────────
const getAllCreators = async (req, res) => {
  try {
    const creators = await Creator.find()
      .populate("userId", "fullName profilePic")
      .sort({ createdAt: -1 });
    res.status(200).json(creators);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ─── Profil créateur ────────────────────────────────
const getCreatorProfile = async (req, res) => {
  try {
    const { creatorId } = req.params;
    const viewerId = req.user._id.toString();

    const creator = await Creator.findOne({ userId: creatorId })
      .populate("userId", "fullName profilePic");
    if (!creator) return res.status(404).json({ message: "Créateur introuvable" });

    const isOwner = viewerId === creatorId;

    const now = new Date();
    const sub = !isOwner && await Subscription.findOne({
      subscriberId: viewerId,
      creatorId,
      status: "active",
      expiresAt: { $gt: now },
    });
    const isSubscribed = isOwner || !!sub;

    const rawPosts = await Post.find({ creatorId }).sort({ createdAt: -1 });
    const posts = rawPosts.map((p) => {
      const obj = p.toObject();
      if (obj.isPremium && !isSubscribed) return { ...obj, mediaUrl: null, locked: true };
      return { ...obj, locked: false };
    });

    const subscriberCount = await Subscription.countDocuments({ creatorId, status: "active", expiresAt: { $gt: now } });

    res.status(200).json({ creator, posts, isSubscribed, isOwner, subscriberCount });
  } catch (err) {
    console.error("getCreatorProfile:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ─── Mettre à jour profil créateur ──────────────────
const updateCreatorProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bio, coverImage, monthlyPrice } = req.body;

    const creator = await Creator.findOne({ userId });
    if (!creator) return res.status(404).json({ message: "Profil introuvable" });

    if (bio          !== undefined) creator.bio = bio;
    if (monthlyPrice !== undefined) creator.monthlyPrice = parseInt(monthlyPrice);
    if (coverImage) {
      const result = await cloudinary.uploader.upload(coverImage, { folder: "tofrex/covers" });
      creator.coverImage = result.secure_url;
    }

    await creator.save();
    res.status(200).json({ message: "Profil mis à jour", creator });
  } catch (err) {
    console.error("updateCreatorProfile:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ─── Publier un post ────────────────────────────────
const uploadPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { caption, isPremium, mediaData, mediaType } = req.body;

    if (!await Creator.findOne({ userId }))
      return res.status(403).json({ message: "Tu n'es pas créateur" });
    if (!mediaData)
      return res.status(400).json({ message: "Média requis" });

    const result = await cloudinary.uploader.upload(mediaData, {
      folder: "tofrex/posts",
      resource_type: mediaType === "video" ? "video" : "image",
    });

    const post = await Post.create({
      creatorId: userId,
      caption:   caption || "",
      mediaUrl:  result.secure_url,
      mediaType: mediaType || "image",
      isPremium: isPremium !== false,
    });

    res.status(201).json({ message: "Post publié !", post });
  } catch (err) {
    console.error("uploadPost:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ─── Supprimer un post ──────────────────────────────
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id.toString();

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post introuvable" });
    if (post.creatorId.toString() !== userId)
      return res.status(403).json({ message: "Non autorisé" });

    const parts    = post.mediaUrl.split("/");
    const fileName = parts[parts.length - 1].split(".")[0];
    await cloudinary.uploader.destroy(`tofrex/posts/${fileName}`, {
      resource_type: post.mediaType === "video" ? "video" : "image",
    });

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post supprimé" });
  } catch (err) {
    console.error("deletePost:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ─── Liker un post ──────────────────────────────────
const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post introuvable" });

    const liked = post.likes.includes(userId);
    if (liked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
      if (post.creatorId.toString() !== userId.toString()) {
        await Notification.create({
          userId:  post.creatorId,
          type:    "like",
          fromId:  userId,
          message: "a aimé ton post",
        });
      }
    }

    await post.save();
    res.status(200).json({ likes: post.likes.length, liked: !liked });
  } catch (err) {
    console.error("likePost:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ─── Feed (posts des créateurs abonnés) ─────────────
const getFeed = async (req, res) => {
  try {
    const userId = req.user._id;
    const now    = new Date();

    const subs = await Subscription.find({
      subscriberId: userId,
      status: "active",
      expiresAt: { $gt: now },
    }).select("creatorId");

    const subscribedIds = subs.map((s) => s.creatorId);

    const posts = await Post.find({
      $or: [
        { creatorId: { $in: subscribedIds } },
        { isPremium: false },
      ],
    })
      .populate("creatorId", "fullName profilePic")
      .sort({ createdAt: -1 })
      .limit(50);

    const enriched = posts.map((p) => {
      const obj = p.toObject();
      const isSubscribed = subscribedIds.some((id) => id.toString() === obj.creatorId._id.toString());
      if (obj.isPremium && !isSubscribed && obj.creatorId._id.toString() !== userId.toString()) {
        return { ...obj, mediaUrl: null, locked: true };
      }
      return { ...obj, locked: false };
    });

    res.status(200).json(enriched);
  } catch (err) {
    console.error("getFeed:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ─── Notifications ───────────────────────────────────
const getNotifications = async (req, res) => {
  try {
    const notifs = await Notification.find({ userId: req.user._id })
      .populate("fromId", "fullName profilePic")
      .sort({ createdAt: -1 })
      .limit(30);
    res.status(200).json(notifs);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const markNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id, read: false }, { read: true });
    res.status(200).json({ message: "Lu" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  becomeCreator, getAllCreators, getCreatorProfile,
  updateCreatorProfile, uploadPost, deletePost,
  likePost, getFeed, getNotifications, markNotificationsRead,
};