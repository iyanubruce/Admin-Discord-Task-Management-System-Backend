import { RequestHandler } from 'express';
import * as routingController from '../../controllers/users';
import * as utilities from '../../helpers/utilities';

export const getUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await routingController.getUsers();
    res.status(200).json(utilities.itemResponse(users, 200, 'users retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await routingController.getUser(id);
    res.status(200).json(utilities.itemResponse(user, 200, 'user retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const { name, discordId } = req.body;
    const user = await routingController.createUser({ name, discordId });
    res.status(201).json(utilities.itemResponse(user, 201, 'user created successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    await routingController.deleteUser(id);
    res.status(200).json(utilities.itemResponse(null, 200, 'user deleted successfully'));
  } catch (error) {
    next(error);
  }
};
