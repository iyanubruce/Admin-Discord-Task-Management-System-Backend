import mongoose, { Schema, Document, Types } from "mongoose";
import User, { UserAttributes } from "./user";

export interface TaskAttributes extends Document {
  _id: Types.ObjectId;
  taskName: string;
  dueDate: Date;
  priority: "Easy" | "Medium" | "Hard";
  assignedUser: Types.ObjectId | UserAttributes;
  category: Types.ObjectId;
  status: "active" | "completed" | "deleted";
  repeatInterval: "none" | "daily" | "weekly" | "monthly";
  lastNotified?: Date | null;
  created_at: Date;
}

const taskSchema = new Schema<TaskAttributes>({
  taskName: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  priority: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },
  assignedUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "completed", "deleted"],
    default: "active",
  },
  repeatInterval: {
    type: String,
    enum: ["none", "daily", "weekly", "monthly"],
    default: "none",
  },
  lastNotified: {
    type: Date,
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Task = mongoose.model<TaskAttributes>("Task", taskSchema);

export default Task;
