import { Router, Request, Response } from 'express';
import Category from '../../../database/models/category';
import Task from '../../../database/models/task';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await Category.find().sort({ created_at: 1 });
    res.json(categories);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const category = new Category({ name });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(400).json({ error: msg });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    if (!category.isDeletable) {
      return res.status(400).json({ error: 'This category cannot be deleted' });
    }

    await Task.deleteMany({ category: id });
    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

export default router;
