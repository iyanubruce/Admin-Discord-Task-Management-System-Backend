import mongoose, { Schema, Document, Types } from "mongoose";
import { UserAttributes } from "./user";
import bcrypt from "bcryptjs";
export interface AdminUserAttributes extends Document {
  _id: Types.ObjectId;
  username: string;
  password: string;
  created_at: Date;
}

const adminUserSchema = new Schema<AdminUserAttributes>({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

adminUserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

const AdminUser = mongoose.model<AdminUserAttributes>(
  "AdminUser",
  adminUserSchema
);

export default AdminUser;
