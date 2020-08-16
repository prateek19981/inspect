const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/secrets");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    console.log("auth", authorization);

    if (!authorization) {
      return res.status(401).json({
        success: false,
        message: "you must be logged in",
      });
    }
    const token = authorization.replace("Bearer ", "");
    console.log("token", JWT_SECRET);
    jwt.verify(token, JWT_SECRET, async (err, payload) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "you must be logged in",
        });
      }

      const { _id } = payload;
      console.log("id", _id);
      const user = await User.findById(_id);
      console.log(user);
      req.user = user;

      next();
    });
  } catch (err) {
    console.log(err);
  }
};
