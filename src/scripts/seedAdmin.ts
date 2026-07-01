import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function seedAdmin() {
  await mongoose.connect(process.env.MONGODB_URI!);
  
  // dynamic import to avoid model registration issues
  const Admin = (await import("../models/Admin")).default;

  const existing = await Admin.findOne({
    email: process.env.ADMIN_EMAIL,
  });

  if (existing) {
    console.log("Admin already exists, skipping seed.");
    await mongoose.disconnect();
    return;
  }

  const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);

  await Admin.create({
    email: process.env.ADMIN_EMAIL,
    password: hashed,
  });

  console.log("Admin seeded successfully.");
  await mongoose.disconnect();
}

seedAdmin().catch(console.error);