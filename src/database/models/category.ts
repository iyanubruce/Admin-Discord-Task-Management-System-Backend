import mongoose, { Schema, Document, Types } from "mongoose";

export interface CategoryAttributes extends Document {
  _id: Types.ObjectId;
  name: string;
  isSpecial: boolean;
  isDeletable: boolean;
  created_at: Date;
}

const categorySchema = new Schema<CategoryAttributes>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  isSpecial: {
    type: Boolean,
    default: false,
  },
  isDeletable: {
    type: Boolean,
    default: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Category = mongoose.model<CategoryAttributes>("Category", categorySchema);

export default Category;
