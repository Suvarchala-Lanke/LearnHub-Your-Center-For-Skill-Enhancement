import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  markLessonCompleted,
  getCompletedLessons,
  enrollStudentManually // ✅ Import the manual enrollment controller
} from '../controllers/userController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 📝 User registration and login
router.post('/register', registerUser);
router.post('/login', loginUser);

// 👤 Protected user profile
router.get('/profile', protect, getUserProfile);

// ✅ Mark a lesson as completed
router.post('/lessons/complete', protect, markLessonCompleted);

// ✅ Get completed lessons for a specific course
router.get('/lessons/completed/:courseId', protect, getCompletedLessons);

// 🛠️ NEW: Manually enroll a student in a course (TEMPORARY DEV ROUTE)
router.post('/enroll-manual', enrollStudentManually); // ✅ Add this route

export default router;
