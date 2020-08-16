const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      require: true,
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    profilepic: {
      type: String,
      default:
        "https://res.cloudinary.com/prateek1234/image/upload/v1597492123/Network-Profile_ebeydj.png",
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
