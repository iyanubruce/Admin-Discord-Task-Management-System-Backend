import mongoose from "mongoose";
import config from "./env";
import Category from "../database/models/category";

async function initializeSpecialCategories() {
  try {
    const completedCategory = await Category.findOne({
      name: "Completed Tasks",
    });
    if (!completedCategory) {
      await Category.create({
        name: "Completed Tasks",
        isSpecial: true,
        isDeletable: false,
      });
      console.log("Created Completed Tasks category");
    }

    const deletedCategory = await Category.findOne({ name: "Deleted Tasks" });
    if (!deletedCategory) {
      await Category.create({
        name: "Deleted Tasks",
        isSpecial: true,
        isDeletable: false,
      });
      console.log("Created Deleted Tasks category");
    }
  } catch (err) {
    console.error("Error initializing special categories:", err);
  }
}

const mongoUri = config.application.database.mongodb_uri;
if (!mongoUri) {
  console.error(
    "MONGODB_URI is not set. Add it to your .env file or environment."
  );
  process.exit(1);
}

mongoose
  .connect(mongoUri, {
    // MongoDB Enterprise connection options
    serverSelectionTimeoutMS:
      config.application.database.serverSelectionTimeoutMS,
    socketTimeoutMS: config.application.database.socketTimeoutMS,
    maxPoolSize: config.application.database.maxPoolSize,
    minPoolSize: config.application.database.minPoolSize,
    retryWrites: true,
    w: "majority",
    // For Enterprise clusters with replica sets
    readPreference: "primary",
    readConcern: { level: "majority" },
  })
  .then(() => {
    console.log("Connected to MongoDB Enterprise");
    // Initialize special categories after connection is established
    initializeSpecialCategories();
  })
  .catch((err) => console.error("MongoDB connection error:", err));

export default mongoose;
