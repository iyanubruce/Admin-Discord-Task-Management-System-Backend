import { UserAttributes } from "../database/models/user";
import ConflictError from "../errors/conflictError";
import ResourceNotFoundError from "../errors/resourceNotFoundError";
import * as userRepository from "../database/repositories/user";

export const getUsers = async (): Promise<UserAttributes[]> => {
  const users = await userRepository.findUsers({
    sort: { created_at: -1 },
  });
  return users;
};

export const getUser = async (userId: string): Promise<UserAttributes> => {
  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new ResourceNotFoundError("User not found");
  }
  return user;
};

export const createUser = async (data: {
  name: string;
  discordId: string;
}): Promise<UserAttributes> => {
  const { name, discordId } = data;

  const existingUser = await userRepository.findUserByDiscordId(discordId);
  if (existingUser) {
    throw new ConflictError(`User with Discord ID ${discordId} already exists`);
  }

  const user = await userRepository.createUser({ name, discordId });
  return user;
};

export const deleteUser = async (userId: string): Promise<void> => {
  const user = await userRepository.deleteUser(userId);
  if (!user) {
    throw new ResourceNotFoundError("User not found");
  }
};
