const mongoose = require("mongoose");

const { databaseURI } = require("./secrets");

mongoose.connect(databaseURI);

let db = mongoose.connection;

db.on("error", console.error.bind(console, "err connection to db"));

db.once("open", () => {
  console.log("db connected successfully");
});

module.exports = db;
