const Post = require("../../models/post");
const User = require("../../models/user");
module.exports.create = async (req, res) => {
  console.log("controller", req.body);
  const { title, body, image } = req.body;
  if (!title || !body || !image) {
    return res.status(401).json({
      success: false,
      messgae: "please fill all  details",
    });
  }

  let currentUser = req.user;

  let post = Post({ title, body, postedBy: currentUser, image });
  console.log(post);
  let submitPost = await post.save();
  console.log("here");
  return res.json({
    success: true,
    message: "suuccessfully submitted post data",
  });
};

module.exports.allPosts = async (req, res) => {
  let posts = await Post.find()
    .populate("postedBy")
    .populate("comments.postedBy");
  return res.json({
    success: true,
    message: "successfully fetched all posts",
    data: posts,
  });
};

module.exports.postByUser = async (req, res) => {
  let currentUser = req.user;
  console.log(currentUser);
  let posts = await Post.find({
    postedBy: currentUser,
  }).populate("postedBy");
  return res.json({
    success: true,
    message: "successfully fetched all posts by user",
    data: posts,
  });
};

module.exports.likePost = async (req, res) => {
  let id = req.body.postid;
  console.log("id", req.user._id);
  Post.findByIdAndUpdate(id, { $push: { likes: req.user._id } }, { new: true })
    .populate("comments.postedBy")
    .populate("postedBy")
    .exec((err, result) => {
      if (err) {
        console.log(err);
        return res.status(422).json({ success: false, message: err });
      } else {
        return res.json({ success: true, message: "liked post", data: result });
      }
    });
};

module.exports.unlikePost = async (req, res) => {
  let id = req.body.postid;
  console.log("id", req.user._id);
  Post.findByIdAndUpdate(id, { $pull: { likes: req.user._id } }, { new: true })
    .populate("comments.postedBy")
    .populate("postedBy")
    .exec((err, result) => {
      if (err) {
        console.log(err);
        return res.status(422).json({ success: false, message: err });
      } else {
        return res.json({
          success: true,
          message: "successfully unliked",
          data: result,
        });
      }
    });
};

module.exports.comment = (req, res) => {
  const { postid } = req.body;
  const { text } = req.body;
  const currUser = req.user;
  Post.findByIdAndUpdate(
    postid,
    {
      $push: { comments: { text: text, postedBy: currUser } },
    },
    { new: true }
  )
    .populate("comments.postedBy")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({
          success: false,
          message: err,
        });
      }

      return res.json({
        success: true,
        data: result,
        message: "comment post success",
      });
    });
};

module.exports.deletePost = async (req, res) => {
  const { postid } = req.body;

  if (!postid) {
    return res.status(422).json({
      seccess: false,
      messgae: "please enter all fields",
    });
  }
  let post = await Post.findById(postid).populate("postedBy");
  console.log("post", post);
  const currUserid = String(req.user._id);
  const postUserid = String(post.postedBy._id);
  console.log("curruser", currUserid);
  console.log("postuser", postUserid);

  console.log(currUserid === postUserid);
  if (currUserid === postUserid) {
    console.log("hereee");
    let result = await Post.findByIdAndDelete(postid);
    console.log("delete", result);
    return res.json({
      success: true,
      message: "deleted successfully",
      data: result,
    });
  }

  return res.status(422).json({
    success: false,
    message: "you cannot del others post",
  });
};

module.exports.listPostByFollowing = async (req, res) => {
  let user = await User.findById(req.user._id);

  let posts = await Post.find({ postedBy: { $in: req.user.following } })
    .populate("postedBy")
    .populate("comments.postedBy");
  if (posts.length == 0) {
    return res.status(422).json({ success: false, message: "no posts" });
  }
  return res.json({
    success: true,
    message: "successfully fetched",
    data: posts,
  });
};
