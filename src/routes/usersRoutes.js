import express from 'express';
import { readAllUsersController, deleteUserByIdController } from '../controllers/usersControllers.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { requireAdmin } from '../middlewares/adminMiddleware.js';

const router = express.Router();

//Admin: Read All User from DB
router.get('/admin/users', authenticate, requireAdmin, readAllUsersController);
// Tested and Working

//Admin: Route to delete a user
router.delete('/admin/users/:userId', authenticate, requireAdmin, deleteUserByIdController);
// Tested and Working

export default router;
