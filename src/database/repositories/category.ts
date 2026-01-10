import Category, { CategoryAttributes } from "../models/category";
import { ClientSession, Types } from "mongoose";

export const createCategory = async (
  data: { name: string; isSpecial?: boolean; isDeletable?: boolean },
  session?: ClientSession
): Promise<CategoryAttributes> => {
  const newCategory = new Category(data);
  return session
    ? await newCategory.save({ session })
    : await newCategory.save();
};

export const findCategoryById = async (
  id: string | Types.ObjectId,
  session?: ClientSession
): Promise<CategoryAttributes | null> => {
  return session
    ? Category.findById(id).session(session)
    : Category.findById(id);
};

export const findCategoryByName = async (
  name: string,
  session?: ClientSession
): Promise<CategoryAttributes | null> => {
  return session
    ? Category.findOne({ name }).session(session)
    : Category.findOne({ name });
};

export const findCategories = async (options: {
  filter?: Record<string, any>;
  select?: string;
  populate?: string | string[];
  limit?: number;
  skip?: number;
  sort?: Record<string, 1 | -1>;
}): Promise<CategoryAttributes[]> => {
  const { filter = {}, select, populate, limit, skip, sort } = options;

  let query = Category.find(filter);

  if (select) query = query.select(select) as any;
  if (populate) query = query.populate(populate);
  if (limit) query = query.limit(limit);
  if (skip) query = query.skip(skip);
  if (sort) query = query.sort(sort);

  return query.exec();
};

export const findCategory = async (options: {
  filter: Partial<Record<string, any>>;
  select?: string;
  populate?: string | string[];
}): Promise<CategoryAttributes | null> => {
  const { filter, select, populate } = options;

  let query = Category.findOne(filter);

  if (select) query = query.select(select) as any;
  if (populate) query = query.populate(populate);

  return query.exec();
};

export const findAndCountCategories = async (options: {
  filter?: Record<string, any>;
  select?: string;
  populate?: string | string[];
  limit?: number;
  skip?: number;
  sort?: Record<string, 1 | -1>;
}): Promise<{ categories: CategoryAttributes[]; count: number }> => {
  const { filter = {}, select, populate, limit, skip, sort } = options;

  const [categories, count] = await Promise.all([
    findCategories({ filter, select, populate, limit, skip, sort }),
    Category.countDocuments(filter),
  ]);

  return { categories, count };
};

export const countCategories = async (options: {
  filter?: Record<string, any>;
}): Promise<number> => {
  const { filter = {} } = options;
  return Category.countDocuments(filter);
};

export const updateCategory = async (
  id: string | Types.ObjectId,
  data: Partial<CategoryAttributes>,
  session?: ClientSession
): Promise<CategoryAttributes | null> => {
  return session
    ? Category.findByIdAndUpdate(id, data, { new: true, session })
    : Category.findByIdAndUpdate(id, data, { new: true });
};

export const deleteCategory = async (
  id: string | Types.ObjectId,
  session?: ClientSession
): Promise<CategoryAttributes | null> => {
  return session
    ? Category.findByIdAndDelete(id).session(session)
    : Category.findByIdAndDelete(id);
};
