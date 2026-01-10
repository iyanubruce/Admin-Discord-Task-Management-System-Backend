import User, { UserAttributes } from "../models/user";
import { ClientSession, Types } from "mongoose";

export const createUser = async (
  data: { name: string; discordId: string },
  session?: ClientSession
): Promise<UserAttributes> => {
  const newUser = new User(data);
  return session ? await newUser.save({ session }) : await newUser.save();
};

export const findUserById = async (
  id: string | Types.ObjectId,
  session?: ClientSession
): Promise<UserAttributes | null> => {
  return session ? User.findById(id).session(session) : User.findById(id);
};

export const findUserByDiscordId = async (
  discordId: string
): Promise<UserAttributes | null> => {
  return User.findOne({ discordId });
};

export const findUsers = async (options: {
  filter?: Record<string, any>;
  select?: string;
  populate?: string | string[];
  limit?: number;
  skip?: number;
  sort?: Record<string, 1 | -1>;
}): Promise<UserAttributes[]> => {
  const { filter = {}, select, populate, limit, skip, sort } = options;

  let query: any = User.find(filter);

  if (select) query = query.select(select);
  if (populate) query = query.populate(populate);
  if (limit) query = query.limit(limit);
  if (skip) query = query.skip(skip);
  if (sort) query = query.sort(sort);

  return query.exec();
};

export const findUser = async (options: {
  filter: Partial<Record<string, any>>;
  select?: string;
  populate?: string | string[];
}): Promise<UserAttributes | null> => {
  const { filter, select, populate } = options;

  let query: any = User.findOne(filter);

  if (select) query = query.select(select);
  if (populate) query = query.populate(populate);

  return query.exec();
};

export const findAndCountUsers = async (options: {
  filter?: Record<string, any>;
  select?: string;
  populate?: string | string[];
  limit?: number;
  skip?: number;
  sort?: Record<string, 1 | -1>;
}): Promise<{ users: UserAttributes[]; count: number }> => {
  const { filter = {}, select, populate, limit, skip, sort } = options;

  const [users, count] = await Promise.all([
    findUsers({ filter, select, populate, limit, skip, sort }),
    User.countDocuments(filter),
  ]);

  return { users, count };
};

export const countUsers = async (options: {
  filter?: Record<string, any>;
}): Promise<number> => {
  const { filter = {} } = options;
  return User.countDocuments(filter);
};

export const updateUser = async (
  id: string | Types.ObjectId,
  data: Partial<UserAttributes>,
  session?: ClientSession
): Promise<UserAttributes | null> => {
  return session
    ? User.findByIdAndUpdate(id, data, { new: true, session })
    : User.findByIdAndUpdate(id, data, { new: true });
};

export const deleteUser = async (
  id: string | Types.ObjectId,
  session?: ClientSession
): Promise<UserAttributes | null> => {
  return session
    ? User.findByIdAndDelete(id).session(session)
    : User.findByIdAndDelete(id);
};
