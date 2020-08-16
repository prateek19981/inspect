const User = require("../../models/user");
const Post = require("../../models/post");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../../config/secrets");
module.exports.signup = async (req, res) => {
  try {
    const { name, email, password, pic } = req.body;
    console.log(req.body);
    if (!name || !email || !password) {
      return res.status(422).json({
        success: false,
        message: "please add all fields",
      });
    }
    let user = await User.findOne({
      email,
    });
    if (user) {
      return res.status(422).json({
        success: false,
        message: "user already exist",
      });
    }
    let hashedPassword = await bcrypt.hash(password, 12);
    user = User({
      name,
      email,
      password: hashedPassword,
      profilepic: pic,
    });
    let success = await user.save();
    console.log(success);
    return res.json({
      success: true,
      message: "successfully submitted user data",
      data: success,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({
        success: false,
        message: "please enter all fields",
      });
    }
    let user = await User.findOne({
      email,
    });
    if (!user) {
      return res.status(422).json({
        success: false,
        message: "invalid email or password",
      });
    }
    let isCorrectpassword = await bcrypt.compare(password, user.password);
    if (!isCorrectpassword) {
      return res.status(422).json({
        success: false,
        message: "invalid email or password",
      });
    }
    const token = jwt.sign({ _id: user._id }, JWT_SECRET);
    return res.json({
      success: true,
      message: "successfully signed in",
      token: token,
      user: user,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.userDetails = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("userid", id);
    let user = await User.findById(id);
    console.log("user", user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "no user found",
      });
    }
    let userpost = await Post.find({ postedBy: id });
    return res.json({
      success: true,
      message: "successfully fetched user details",
      data: {
        user,
        userpost,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.follow = async (req, res) => {
  const { whoToFollow } = req.body;
  if (!whoToFollow) {
    return res.status(422).json({
      success: false,
      message: "please fill all details",
    });
  }

  User.findByIdAndUpdate(
    whoToFollow,
    {
      $push: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return (
          res.status(422),
          json({
            success: false,
            message: err,
          })
        );
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: whoToFollow },
        },
        {
          new: true,
        },
        (err, result) => {
          if (err) {
            return (
              res.status(422),
              json({
                success: false,
                message: err,
              })
            );
          }
          return res.json({
            success: true,
            message:
              "user followed, updated your following and followed user's followers",
            data: result,
          });
        }
      ).select("-password");
    }
  );
};

module.exports.unfollow = async (req, res) => {
  const { whoToUnFollow } = req.body;
  if (!whoToUnFollow) {
    return res.status(422).json({
      success: false,
      message: "please fill all details",
    });
  }

  User.findByIdAndUpdate(
    whoToUnFollow,
    {
      $pull: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return (
          res.status(422),
          json({
            success: false,
            message: err,
          })
        );
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: whoToUnFollow },
        },
        {
          new: true,
        },
        (err, result) => {
          if (err) {
            return (
              res.status(422),
              json({
                success: false,
                message: err,
              })
            );
          }
          return res.json({
            success: true,
            message:
              "user unfollowed, updated your following and followed user's followers",
            data: result,
          });
        }
      ).select("-password");
    }
  );
};

module.exports.changeProfilepic = async (req, res) => {
  try {
    const { profilepic } = req.body;
    let user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: { profilepic: profilepic },
      },
      { new: true }
    );
    return res.json({ success: true, message: "update success", data: user });
  } catch (err) {
    console.log(err);
  }
};
