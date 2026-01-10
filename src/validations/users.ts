import { z } from 'zod';

export const createUserSchema = {
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    discordId: z.string().min(1, 'Discord ID is required'),
  }),
};

export const deleteUserSchema = {
  params: z.object({
    id: z.string().min(1, 'User ID is required'),
  }),
};
