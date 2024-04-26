const shortid = require("shortid");
const URL = require("../models/url");
async function handleGenerateNewUrl(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: " url required " });
  const shortID = shortid();
  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitHistory: [],
    createdBy: req.user._id,
  });
  return res.render("home", {
    id: shortID,
  });
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;

  const result = await URL.findOne({ shortId });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = { handleGenerateNewUrl, handleGetAnalytics };

// const shortid = require("shortid");
// const URL = require("../models/url");

// async function handleGenerateNewUrl(req, res) {
//   const body = req.body;
//   if (!body.url) return res.status(400).json({ error: "URL required" });
//   const shortID = shortid.generate(); // Corrected shortid function call
//   await URL.create({
//     shortId: shortID,
//     redirectURL: body.url,
//     visitHistory: [], // Corrected field name
//   });
//   return res.json({ id: shortID });
// }

// module.exports = { handleGenerateNewUrl };
