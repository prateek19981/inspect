const express = require("express");

const router = express.Router();

router.use("/user", require("./users"));
router.use("/posts", require("./post"));

module.exports = router;
