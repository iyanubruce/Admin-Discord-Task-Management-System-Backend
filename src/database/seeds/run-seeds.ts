import { connectDB } from "../../config/database";
import { seedAdminUser } from "./01-admin.seed";
import logger from "../../utils/logger";

const runSeeds = async () => {
  await connectDB();

  try {
    await seedAdminUser();
    // Add more seeders here in order
    logger.info("🌱 All seeds completed successfully");
    process.exit(0);
  } catch (error) {
    logger.error("❌ Seed failed:", error);
    process.exit(1);
  }
};

runSeeds();
