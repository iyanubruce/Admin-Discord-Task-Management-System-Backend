import { RequestHandler } from "express";
import * as routingController from "../../controllers/tasks";
import * as utilities from "../../helpers/utilities";

export const getTasks: RequestHandler = async (req, res, next) => {
  try {
    const tasks = await routingController.getTasks();
    res
      .status(200)
      .json(utilities.itemResponse(tasks, 200, "tasks retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const createTask: RequestHandler = async (req, res, next) => {
  try {
    const {
      taskName,
      dueDate,
      priority,
      assignedUser,
      category,
      repeatInterval,
    } = req.body;
    const task = await routingController.createTask({
      taskName,
      dueDate,
      priority,
      assignedUser,
      category,
      repeatInterval,
    });
    res
      .status(201)
      .json(utilities.itemResponse(task, 201, "task created successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateTask: RequestHandler = async (req, res, next) => {
  try {
    console.log("reached reached");

    const { id } = req.params;
    const {
      taskName,
      dueDate,
      priority,
      assignedUser,
      category,
      repeatInterval,
    } = req.body;

    const task = await routingController.updateTask(id, {
      taskName,
      dueDate,
      priority,
      assignedUser,
      category,
      repeatInterval,
    });
    res
      .status(200)
      .json(utilities.itemResponse(task, 200, "task updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const deleteTask: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await routingController.deleteTask(id);
    res.status(200).json(utilities.itemResponse(result, 200, result.message));
  } catch (error) {
    next(error);
  }
};

export const completeTask: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await routingController.completeTask(id);
    res
      .status(200)
      .json(utilities.itemResponse(task, 200, "task completed successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateTaskCategory: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category } = req.body;
    const task = await routingController.updateTaskCategory(id, category);
    res
      .status(200)
      .json(
        utilities.itemResponse(task, 200, "task category updated successfully")
      );
  } catch (error) {
    next(error);
  }
};

export const testNotification: RequestHandler = async (req, res, next) => {
  try {
    const { taskId, type } = req.body;
    const result = await routingController.testNotification(taskId, type);
    res.status(200).json(utilities.itemResponse(result, 200, result.message));
  } catch (error) {
    next(error);
  }
};
