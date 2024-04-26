const express = require("express");
const URL = require("./models/url");
const { connectToMongoDb } = require("./connect");
const path = require("path");
const cookieParser = require("cookie-parser");
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middleware/auth");

const app = express();
const PORT = 8001;

connectToMongoDb("mongodb://127.0.0.1:27017/shortid-url").then(() => {
  console.log("mongoDb is connected");
});

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", checkAuth, staticRoute);
app.use("/user", userRoute);
app.use("/url", restrictToLoggedinUserOnly, urlRoute);

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortId },
    {
      $push: {
        visitHistory: { timestamp: Date.now() },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => {
  console.log(`server is started at PORT ${PORT}`);
});

// ******************** --New Update-- ************************//

// const express = require("express");
// const URL = require("./models/url");
// const { connectToMongoDb } = require("./connect");
// const urlRoute = require("./routes/url");
// const app = express();
// const PORT = 8001;

// connectToMongoDb("mongodb://127.0.0.1:27017/shortid-url");

// app.use(express.json());
// app.use("/url", urlRoute);
// app.get("/:shortId", async (req, res) => {
//   const shortId = req.params.shortId;
//   try {
//     const entry = await URL.findOneAndUpdate(
//       { shortId },
//       {
//         $push: {
//           visitHistory: { timestamp: Date.now() },
//         },
//       },
//       { new: true } // Return the modified document
//     );
//     if (entry) {
//       return res.redirect(entry.redirectURL);
//     } else {
//       return res.status(404).send("URL not found");
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).send("Internal Server Error");
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is started at PORT ${PORT}`);
// });
