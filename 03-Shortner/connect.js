const mongoose = require("mongoose");
async function connectToMongoDb(url) {
  return mongoose.connect(url);
}

module.exports = { connectToMongoDb };

// const mongoose = require("mongoose");

// async function connectToMongoDb(url) {
//   try {
//     await mongoose.connect(url);
//     console.log("MongoDB connected successfully");
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//   }
// }

// module.exports = { connectToMongoDb };
