import { findAdmin, findAdminByUsername } from "../database/repositories/admin";
import bcrypt from "bcryptjs";
import JWT from "../helpers/jwt";
import { BadRequestError, NotAuthenticatedError } from "../errors";

export const adminLogin = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<string> => {
  const admin = await findAdminByUsername(username);

  if (!admin) {
    throw new BadRequestError("Invalid username or password");
  }

  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) {
    throw new BadRequestError("Invalid username or password");
  }

  const token = JWT.encode({
    user: admin._id,
  });

  return token;
};

export const validateAccessToken = async (token: string): Promise<boolean> => {
  try {
    const decoded = JWT.decode(token);

    const admin = await findAdmin({
      filter: { id: decoded.id },
    });

    if (!admin) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};
