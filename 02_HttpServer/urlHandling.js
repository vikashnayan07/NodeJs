const http = require("http");
const fs = require("fs");
const url = require("url");
const server = http.createServer((req, res) => {
  const log = `${Date.now()}: ${req.url} New Requested Received!!\n`;
  if (req.url === "/favicon.ico") return res.end();
  const myUrl = url.parse(req.url, true);
  console.log(myUrl);
  fs.appendFile("log.txt", log, (err, data) => {
    switch (myUrl.pathname) {
      case "/":
        co;
        res.end(`<h1> HomePage </h1>`);
        break;
      case "/about":
        const username = myUrl.query.myname;
        res.end(`Hi, ${username}`);
        break;
      case "/search":
        const search = myUrl.query.search_query;
        res.end("Here are your result for" + search);
      default:
        res.end("404 Error!");
    }
  });
});
server.listen(4000, () => {
  console.log("server started");
});
