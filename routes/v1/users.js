const express = require("express");
const userController = require("../../controllers/v1/userController");
const requireLogin = require("../../middlewares/requirelogin");

const router = express.Router();

router.post("/signup", userController.signup);
router.post("/signin", userController.signin);
router.get("/:id", requireLogin, userController.userDetails);
router.post("/follow", requireLogin, userController.follow);
router.post("/unfollow", requireLogin, userController.unfollow);

router.put("/updateprofilepic", requireLogin, userController.changeProfilepic);

module.exports = router;
