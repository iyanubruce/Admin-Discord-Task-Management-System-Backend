import AdminUser, { AdminUserAttributes } from "../models/admin";
import { ClientSession, Types } from "mongoose";

export const createAdmin = async (
  data: { username: string; password: string },
  session?: ClientSession
): Promise<AdminUserAttributes> => {
  const newAdmin = new AdminUser(data);
  return session ? await newAdmin.save({ session }) : await newAdmin.save();
};

export const findAdminById = async (
  id: string | Types.ObjectId,
  session?: ClientSession
): Promise<AdminUserAttributes | null> => {
  return session
    ? AdminUser.findById(id).session(session)
    : AdminUser.findById(id);
};

export const findAdminByUsername = async (
  username: string
): Promise<AdminUserAttributes | null> => {
  return AdminUser.findOne({ username });
};

export const findAdmins = async (options: {
  filter?: Record<string, any>;
  select?: string;
  populate?: string | string[];
  limit?: number;
  skip?: number;
  sort?: Record<string, 1 | -1>;
}): Promise<AdminUserAttributes[]> => {
  const { filter = {}, select, populate, limit, skip, sort } = options;

  let query: any = AdminUser.find(filter);

  if (select) query = query.select(select);
  if (populate) query = query.populate(populate);
  if (limit) query = query.limit(limit);
  if (skip) query = query.skip(skip);
  if (sort) query = query.sort(sort);

  return query.exec();
};

export const findAdmin = async (options: {
  filter: Partial<Record<string, any>>;
  select?: string;
  populate?: string | string[];
}): Promise<AdminUserAttributes | null> => {
  const { filter, select, populate } = options;

  let query: any = AdminUser.findOne(filter);

  if (select) query = query.select(select);
  if (populate) query = query.populate(populate);

  return query.exec();
};

export const findAndCountAdmins = async (options: {
  filter?: Record<string, any>;
  select?: string;
  populate?: string | string[];
  limit?: number;
  skip?: number;
  sort?: Record<string, 1 | -1>;
}): Promise<{ admins: AdminUserAttributes[]; count: number }> => {
  const { filter = {}, select, populate, limit, skip, sort } = options;

  const [admins, count] = await Promise.all([
    findAdmins({ filter, select, populate, limit, skip, sort }),
    AdminUser.countDocuments(filter),
  ]);

  return { admins, count };
};

export const countAdmins = async (options: {
  filter?: Record<string, any>;
}): Promise<number> => {
  const { filter = {} } = options;
  return AdminUser.countDocuments(filter);
};

export const updateAdmin = async (
  id: string | Types.ObjectId,
  data: Partial<AdminUserAttributes>,
  session?: ClientSession
): Promise<AdminUserAttributes | null> => {
  return session
    ? AdminUser.findByIdAndUpdate(id, data, { new: true, session })
    : AdminUser.findByIdAndUpdate(id, data, { new: true });
};

export const deleteAdmin = async (
  id: string | Types.ObjectId,
  session?: ClientSession
): Promise<AdminUserAttributes | null> => {
  return session
    ? AdminUser.findByIdAndDelete(id).session(session)
    : AdminUser.findByIdAndDelete(id);
};
