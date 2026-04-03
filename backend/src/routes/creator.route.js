const express = require("express");
const {
  becomeCreator,
  getCreatorProfile,
  updateCreatorProfile,
  uploadPost,
  deletePost,
} = require("../controllers/creator.controller");
const { protectRoute }     = require("../middleware/auth.middleware");
const { arcjetProtection } = require("../middleware/arcjet.middleware");

const router = express.Router();

router.use(arcjetProtection, protectRoute);

router.post("/become",           becomeCreator);
router.put("/profile",           updateCreatorProfile);
router.post("/posts",            uploadPost);
router.delete("/posts/:postId",  deletePost);
router.get("/:creatorId",        getCreatorProfile);

module.exports = router;