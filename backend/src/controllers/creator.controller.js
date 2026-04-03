const Creator      = require("../models/Creator");
const Post         = require("../models/Post");
const User         = require("../models/User");
const Subscription = require("../models/Subscription");
const cloudinary   = require("../lib/cloudinary");
const ls           = require("../lib/lemonsqueezy");
const { ENV }      = require("../lib/env");

// ─── Devenir créateur ───────────────────────────────────────────
const becomeCreator = async (req, res) => {
  try {
    const { bio, monthlyPrice } = req.body;
    const userId = req.user._id;

    if (await Creator.findOne({ userId }))
      return res.status(400).json({ message: "Tu es déjà créateur" });

    const price = parseFloat(monthlyPrice);
    if (!price || price < 1)
      return res.status(400).json({ message: "Prix minimum : $1/mois" });

    const user = await User.findById(userId);
    const priceInCents = Math.round(price * 100);

    // 1. Créer un produit LemonSqueezy pour ce créateur
    const productRes = await ls.post("/products", {
      data: {
        type: "products",
        attributes: {
          name: `${user.fullName} — Abonnement mensuel`,
          description: bio || `Abonnez-vous à ${user.fullName}`,
        },
        relationships: {
          store: { data: { type: "stores", id: ENV.LEMONSQUEEZY_STORE_ID } },
        },
      },
    });

    const lsProductId = productRes.data.data.id;

    // 2. Créer un variant (abonnement mensuel) pour ce produit
    const variantRes = await ls.post("/variants", {
      data: {
        type: "variants",
        attributes: {
          name:           "Mensuel",
          price:          priceInCents,
          is_subscription: true,
          interval:       "month",
          interval_count: 1,
        },
        relationships: {
          product: { data: { type: "products", id: lsProductId } },
        },
      },
    });

    const lsVariantId = variantRes.data.data.id;

    // 3. Sauvegarder le créateur
    const creator = await Creator.create({
      userId,
      bio:          bio || "",
      monthlyPrice: priceInCents,
      lsProductId,
      lsVariantId,
    });

    await User.findByIdAndUpdate(userId, { isCreator: true });

    res.status(201).json({ message: "Profil créateur créé !", creator });
  } catch (err) {
    console.error("becomeCreator:", err.response?.data || err.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ─── Profil créateur ────────────────────────────────────────────
const getCreatorProfile = async (req, res) => {
  try {
    const { creatorId } = req.params;
    const viewerId = req.user._id.toString();

    const creator = await Creator.findOne({ userId: creatorId })
      .populate("userId", "fullName profilePic");
    if (!creator) return res.status(404).json({ message: "Créateur introuvable" });

    const isOwner = viewerId === creatorId;

    const isSubscribed = isOwner || !!(await Subscription.findOne({
      subscriberId: viewerId,
      creatorId,
      status: "active",
    }));

    const rawPosts = await Post.find({ creatorId }).sort({ createdAt: -1 });

    const posts = rawPosts.map((post) => {
      const obj = post.toObject();
      if (obj.isPremium && !isSubscribed) {
        return { ...obj, mediaUrl: null, locked: true };
      }
      return { ...obj, locked: false };
    });

    res.status(200).json({ creator, posts, isSubscribed, isOwner });
  } catch (err) {
    console.error("getCreatorProfile:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ─── Mettre à jour le profil créateur ───────────────────────────
const updateCreatorProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bio, coverImage } = req.body;

    const creator = await Creator.findOne({ userId });
    if (!creator) return res.status(404).json({ message: "Profil introuvable" });

    if (bio !== undefined) creator.bio = bio;

    if (coverImage) {
      const result = await cloudinary.uploader.upload(coverImage, {
        folder: "tofrex/covers",
        resource_type: "image",
      });
      creator.coverImage = result.secure_url;
    }

    await creator.save();
    res.status(200).json({ message: "Profil mis à jour", creator });
  } catch (err) {
    console.error("updateCreatorProfile:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ─── Publier un post ────────────────────────────────────────────
const uploadPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { caption, isPremium, mediaData, mediaType } = req.body;

    if (!await Creator.findOne({ userId }))
      return res.status(403).json({ message: "Tu n'es pas créateur" });

    if (!mediaData)
      return res.status(400).json({ message: "Média requis" });

    const resourceType = mediaType === "video" ? "video" : "image";
    const result = await cloudinary.uploader.upload(mediaData, {
      folder: "tofrex/posts",
      resource_type: resourceType,
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

// ─── Supprimer un post ──────────────────────────────────────────
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id.toString();

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post introuvable" });
    if (post.creatorId.toString() !== userId)
      return res.status(403).json({ message: "Non autorisé" });

    const urlParts  = post.mediaUrl.split("/");
    const fileName  = urlParts[urlParts.length - 1].split(".")[0];
    const publicId  = `tofrex/posts/${fileName}`;

    await cloudinary.uploader.destroy(publicId, {
      resource_type: post.mediaType === "video" ? "video" : "image",
    });

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post supprimé" });
  } catch (err) {
    console.error("deletePost:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  becomeCreator,
  getCreatorProfile,
  updateCreatorProfile,
  uploadPost,
  deletePost,
};