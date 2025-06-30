// routes/adminRoutes.js
import express from 'express';
import { getAllUsers, deleteUser, promoteToTeacher } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router = express.Router();

router.get('/users', protect, isAdmin, getAllUsers);
router.delete('/users/:id', protect, isAdmin, deleteUser);
router.put('/users/:id/promote', protect, isAdmin, promoteToTeacher);

export default router;
