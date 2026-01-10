import { RequestHandler } from "express";
import * as routingController from "../../controllers/categories";
import * as utilities from "../../helpers/utilities";

export const getCategories: RequestHandler = async (req, res, next) => {
  try {
    const categories = await routingController.getCategories();
    res
      .status(200)
      .json(
        utilities.itemResponse(
          categories,
          200,
          "categories retrieved successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

export const createCategory: RequestHandler = async (req, res, next) => {
  try {
    const { name } = req.body;
    const category = await routingController.createCategory({ name });
    res
      .status(201)
      .json(
        utilities.itemResponse(category, 201, "category created successfully")
      );
  } catch (error) {
    next(error);
  }
};

export const deleteCategory: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    await routingController.deleteCategory(id);
    res
      .status(200)
      .json(utilities.itemResponse(null, 200, "category deleted successfully"));
  } catch (error) {
    next(error);
  }
};
