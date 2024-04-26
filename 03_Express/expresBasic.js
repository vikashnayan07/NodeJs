const http = require("http");
const express = require("express");
const app = express();
app.get("/", (req, res) => {
  return res.send("Hello , This is HomePage");
});
app.get("/about", (req, res) => {
  res.send(`Hello , ${req.query.name}`);
});

const myServer = http.createServer(app);
myServer.listen(4000, () => {
  console.log("server is started");
});
