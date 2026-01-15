import { z } from "zod";

export const createCategorySchema = {
  body: z.object({
    name: z.string().min(1, "Category name is required"),
    isSpecial: z.boolean().optional(),
    isDeletable: z.boolean().optional(),
  }),
};

export const deleteCategorySchema = {
  params: z.object({
    id: z.string().min(1, "Category ID is required"),
  }),
};
