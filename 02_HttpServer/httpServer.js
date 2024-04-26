const http = require("http");
const fs = require("fs");
const server = http.createServer((req, res) => {
  const log = `${Date.now()}: ${req.url} New Requested Received!!\n`;
  fs.appendFile("log.txt", log, (err, data) => {
    switch (req.url) {
      case "/":
        res.end(`<h1> HomePage </h1>`);
        break;
      case "/about":
        res.end("This is Vikash Nayan");
        break;
      default:
        res.end("404 Error!");
    }
  });
});
server.listen(4000, () => {
  console.log("server started");
});
