const express = require("express");
const {
  becomeCreator, getAllCreators, getCreatorProfile,
  updateCreatorProfile, uploadPost, deletePost,
  likePost, getFeed, getNotifications, markNotificationsRead,
} = require("../controllers/creator.controller");
const { protectRoute }     = require("../middleware/auth.middleware");
const { arcjetProtection } = require("../middleware/arcjet.middleware");

const router = express.Router();
router.use(arcjetProtection, protectRoute);

router.get("/feed",                     getFeed);
router.get("/notifications",            getNotifications);
router.put("/notifications/read",       markNotificationsRead);
router.get("/",                         getAllCreators);
router.post("/become",                  becomeCreator);
router.put("/profile",                  updateCreatorProfile);
router.post("/posts",                   uploadPost);
router.delete("/posts/:postId",         deletePost);
router.post("/posts/:postId/like",      likePost);
router.get("/:creatorId",               getCreatorProfile);

module.exports = router;