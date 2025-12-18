const mongoose = require("mongoose");

const connectToMongo = async () => {
  const mongoURI = process.env.mongoURI || process.env.MONGO_URI;

  if (!mongoURI) {
    console.warn("Mongo connection string missing. Set mongoURI/MONGO_URI in .env. Running without DB.");
    return; // Don't exit, allow server to start for local UI checks
  }

  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    console.log("Connected to MongoDB Successfully!");
  } catch (error) {
    console.warn("Error connecting to MongoDB:", error.message);
    console.warn("Continuing without DB connection (limited API functionality).");
  }

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err.message);
  });
};

module.exports = connectToMongo;
