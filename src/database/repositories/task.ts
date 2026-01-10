import Task, { TaskAttributes } from "../models/task";
import { ClientSession, Types } from "mongoose";

export const createTask = async (
  data: {
    taskName: string;
    dueDate: Date;
    priority: "Easy" | "Medium" | "Hard";
    assignedUser: string | Types.ObjectId;
    category: string | Types.ObjectId;
    repeatInterval?: string;
    status?: string;
  },
  session?: ClientSession
): Promise<TaskAttributes> => {
  const newTask = new Task(data);
  return session ? await newTask.save({ session }) : await newTask.save();
};

export const findTaskById = async (
  id: string | Types.ObjectId,
  options?: {
    session?: ClientSession;
    populate?: string | string[];
  }
): Promise<TaskAttributes | null> => {
  const { session, populate } = options || {};

  let query = Task.findById(id);

  if (session) query = query.session(session);
  if (populate) query = query.populate(populate);

  return query.exec();
};

export const findTasks = async (options: {
  filter?: Record<string, any>;
  select?: string;
  populate?: string | string[];
  limit?: number;
  skip?: number;
  sort?: Record<string, 1 | -1>;
}): Promise<TaskAttributes[]> => {
  const { filter = {}, select, populate, limit, skip, sort } = options;

  let query = Task.find(filter);

  if (select) query = query.select(select) as any;
  if (populate) query = query.populate(populate);
  if (limit) query = query.limit(limit);
  if (skip) query = query.skip(skip);
  if (sort) query = query.sort(sort);

  return query.exec();
};

export const findTask = async (options: {
  filter: Partial<Record<string, any>>;
  select?: string;
  populate?: string | string[];
}): Promise<TaskAttributes | null> => {
  const { filter, select, populate } = options;

  let query = Task.findOne(filter);

  if (select) query = query.select(select) as any;
  if (populate) query = query.populate(populate);

  return query.exec();
};

export const findAndCountTasks = async (options: {
  filter?: Record<string, any>;
  select?: string;
  populate?: string | string[];
  limit?: number;
  skip?: number;
  sort?: Record<string, 1 | -1>;
}): Promise<{ tasks: TaskAttributes[]; count: number }> => {
  const { filter = {}, select, populate, limit, skip, sort } = options;

  const [tasks, count] = await Promise.all([
    findTasks({ filter, select, populate, limit, skip, sort }),
    Task.countDocuments(filter),
  ]);

  return { tasks, count };
};

export const countTasks = async (options: {
  filter?: Record<string, any>;
}): Promise<number> => {
  const { filter = {} } = options;
  return Task.countDocuments(filter);
};

export const updateTask = async (
  id: string | Types.ObjectId,
  data: Partial<TaskAttributes>,
  options?: {
    session?: ClientSession;
    runValidators?: boolean;
    populate?: string | string[];
  }
): Promise<TaskAttributes | null> => {
  const { session, runValidators = true, populate } = options || {};

  let query = Task.findByIdAndUpdate(id, data, { new: true, runValidators });

  if (session) query = query.session(session);
  if (populate) query = query.populate(populate);

  return query.exec();
};

export const deleteTask = async (
  id: string | Types.ObjectId,
  session?: ClientSession
): Promise<TaskAttributes | null> => {
  return session
    ? Task.findByIdAndDelete(id).session(session)
    : Task.findByIdAndDelete(id);
};

export const deleteManyTasks = async (
  filter: Record<string, any>,
  session?: ClientSession
): Promise<{ deletedCount?: number }> => {
  return session
    ? Task.deleteMany(filter).session(session)
    : Task.deleteMany(filter);
};
