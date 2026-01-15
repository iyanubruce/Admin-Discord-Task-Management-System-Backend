import mongoose from "mongoose";
import config from "./env";
import Category from "../database/models/category";
import logger from "../utils/logger";

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
      logger.info("Created Completed Tasks category");
    }

    const deletedCategory = await Category.findOne({ name: "Deleted Tasks" });
    if (!deletedCategory) {
      await Category.create({
        name: "Deleted Tasks",
        isSpecial: true,
        isDeletable: false,
      });
      logger.info("Created Deleted Tasks category");
    }
  } catch (err) {
    logger.error("Error initializing special categories:", err);
  }
}

const mongoUri = config.application.database.mongodb_uri;
if (!mongoUri) {
  logger.error(
    "MONGODB_URI is not set. Add it to your .env file or environment."
  );
  process.exit(1);
}

mongoose.set("strictQuery", true); // This enables strict query mode globally

export async function connectDB() {
  try {
    await mongoose.connect(mongoUri, {
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
    });
    logger.info("✅ Connected to DB");
    // Initialize special categories after connection is established
    await initializeSpecialCategories();
  } catch (err) {
    logger.error(`❌ MongoDB connection error: ${JSON.stringify(err)}`);
    throw err;
  }
}

export default mongoose;
