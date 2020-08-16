const express = require("express");
const homeController = require("../controllers/v1/homeController");

const router = express.Router();

router.use("/v1", require("./v1"));

module.exports = router;
