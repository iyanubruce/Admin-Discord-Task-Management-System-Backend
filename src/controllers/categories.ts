import { CategoryAttributes } from "../database/models/category";
import ResourceNotFoundError from "../errors/resourceNotFoundError";
import BadRequestError from "../errors/badRequestError";
import * as categoryRepository from "../database/repositories/category";
import * as taskRepository from "../database/repositories/task";

export const getCategories = async (): Promise<CategoryAttributes[]> => {
  const categories = await categoryRepository.findCategories({
    sort: { created_at: 1 },
  });
  return categories;
};

export const createCategory = async (data: {
  name: string;
}): Promise<CategoryAttributes> => {
  const { name } = data;
  const category = await categoryRepository.createCategory({ name });
  return category;
};

export const deleteCategory = async (categoryId: string): Promise<void> => {
  const category = await categoryRepository.findCategoryById(categoryId);

  if (!category) {
    throw new ResourceNotFoundError("Category not found");
  }

  if (!category.isDeletable) {
    throw new BadRequestError("This category cannot be deleted");
  }

  await taskRepository.deleteManyTasks({ category: categoryId });
  await categoryRepository.deleteCategory(categoryId);
};
