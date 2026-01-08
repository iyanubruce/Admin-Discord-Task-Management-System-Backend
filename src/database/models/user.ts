import mongoose, { Schema, Document, Types } from "mongoose";

export interface UserAttributes extends Document {
  _id: Types.ObjectId;
  name: string;
  discordId: string;
  created_at: Date;
}
const userSchema = new Schema<UserAttributes>({
  name: {
    type: String,
    required: true,
  },
  discordId: {
    type: String,
    required: true,
    unique: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model<UserAttributes>("User", userSchema);

export default User;
