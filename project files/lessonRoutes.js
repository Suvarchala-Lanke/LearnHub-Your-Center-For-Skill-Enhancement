// ✅ Final Code — routes/lessonRoutes.js
import express from 'express';
import {
  getLessonsByCourse,
  addLesson,
  updateLesson,
  deleteLesson,
} from '../controllers/lessonController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 📚 Lesson Routes
router.get('/:courseId', protect, getLessonsByCourse);  // Get all lessons for a course
router.post('/', protect, addLesson);                   // Add a lesson
router.put('/:id', protect, updateLesson);              // ✏️ Edit lesson
router.delete('/:id', protect, deleteLesson);           // ❌ Delete lesson

export default router;
