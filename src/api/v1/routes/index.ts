import { Router } from 'express';
import usersRouter from './users';
import categoriesRouter from './categories';
import tasksRouter from './tasks';

const router = Router();

router.use('/users', usersRouter);
router.use('/categories', categoriesRouter);
router.use('/tasks', tasksRouter);

export default router;
