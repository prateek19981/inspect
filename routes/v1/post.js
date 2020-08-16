const express = require("express");
const postController = require("../../controllers/v1/postController");
const requireLogin = require("../../middlewares/requirelogin");
const router = express.Router();

router.post("/create", requireLogin, postController.create);
router.get("/all", requireLogin, postController.allPosts);
router.get("/", requireLogin, postController.postByUser);
router.post("/like", requireLogin, postController.likePost);
router.post("/unlike", requireLogin, postController.unlikePost);
router.post("/postcomment", requireLogin, postController.comment);
router.post("/deletepost", requireLogin, postController.deletePost);
router.get(
  "/postbyfollowing",
  requireLogin,
  postController.listPostByFollowing
);

module.exports = router;
