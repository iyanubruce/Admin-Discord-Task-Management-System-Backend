import { Router, Request, Response } from "express";
import User from "../../../database/models/user";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await User.find().sort({ created_at: -1 });
    res.json(users);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, discordId } = req.body;

    const existingUser = await User.findOne({ discordId });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: `User with Discord ID ${discordId} already exists` });
    }

    const user = new User({ name, discordId });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    if ((err as any)?.code === 11000) {
      res
        .status(400)
        .json({ error: "A user with this Discord ID already exists" });
    } else {
      const msg = err instanceof Error ? err.message : String(err);
      res.status(400).json({ error: msg });
    }
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

export default router;
