import admin from "../models/admin";
import logger from "../../utils/logger";
import config from "../../config/env";

export const seedAdminUser = async () => {
  const existingAdmin = await admin.findOne({
    username: config.admin.username,
  });

  if (existingAdmin) {
    logger.info("Admin user already exists, skipping seeding.");
    return;
  }

  const newAdmin = new admin({
    username: config.admin.username,
    password: config.admin.password,
  });

  await newAdmin.save();
  logger.info("Admin user seeded successfully.");
};
