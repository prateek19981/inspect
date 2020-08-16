const express = require("express");
const db = require("./config/mongoose");
const port = process.env.POST || 8000;

const app = express();
//fEYu6G7VZXEeElgi

app.use(express.json());
app.use(require("./routes"));

if (process.env.NODE_ENV == "production") {
  app.use(express.static("frontend/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}
app.listen(port, (err) => {
  if (err) {
    console.log("err in connecting to server");
    return;
  }

  console.log("server connected successfully");
});
