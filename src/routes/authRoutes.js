import express from 'express';

import { registerController, loginController, logoutController, resetPasswordController } from '../controllers/authControllers.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

//Public: New User Registration Route
router.post('/users/reg', registerController);
//Tested and Working

//Public: User Login Route
router.post('/users/login', loginController);
//Tested and Working

//User: User Logout Route
router.post('/users/logout', authenticate, logoutController);
//Tested and Working

//Public: Reset Password Route
router.post('/users/reset', resetPasswordController);
//Tested and Working

export default router;
