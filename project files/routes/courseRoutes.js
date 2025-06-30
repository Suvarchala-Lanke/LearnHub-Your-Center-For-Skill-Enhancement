// routes/courseRoutes.js
import express from 'express';
import Course from '../models/Course.js';
import { protect } from '../middleware/authMiddleware.js';
import { getAllCourses } from '../controllers/courseController.js';

const router = express.Router();

// ✅ Create Course (Only for teachers)
router.post('/', protect, async (req, res) => {
  if (req.user.type !== 'teacher') {
    return res.status(403).json({ message: 'Only teachers can add courses' });
  }

  const newCourse = new Course({
    userID: req.user.id,
    ...req.body,
  });

  await newCourse.save();
  res.status(201).json(newCourse);
});

// ✅ Get all courses (with search, lessons, and progress data)
router.get('/', protect, getAllCourses);

// ✅ Get courses created by logged-in teacher
router.get('/my', protect, async (req, res) => {
  const courses = await Course.find({ userID: req.user.id });
  res.json(courses);
});

// ✅ Update course title & description
router.put('/:id', protect, async (req, res) => {
  const { C_title, C_description } = req.body;
  const course = await Course.findById(req.params.id);

  if (!course || course.userID.toString() !== req.user.id) {
    return res.status(403).json({ message: 'You can’t edit this course' });
  }

  course.C_title = C_title || course.C_title;
  course.C_description = C_description || course.C_description;
  await course.save();

  res.json({ message: 'Course updated', course });
});

// ✅ Add section to a course
router.patch('/:id/sections', protect, async (req, res) => {
  const { section } = req.body;
  const course = await Course.findById(req.params.id);

  if (!course || course.userID.toString() !== req.user.id) {
    return res.status(403).json({ message: 'You can’t update this course' });
  }

  course.sections.push(section);
  await course.save();
  res.json(course);
});

// ✅ Delete course
router.delete('/:id', protect, async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course || course.userID.toString() !== req.user.id) {
    return res.status(403).json({ message: 'You can’t delete this course' });
  }

  await course.deleteOne();
  res.json({ message: 'Course deleted' });
});

// ✅ Enroll a student in a course
router.patch('/:id/enroll', protect, async (req, res) => {
  if (req.user.type !== 'student') {
    return res.status(403).json({ message: 'Only students can enroll in courses' });
  }

  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });

  if (course.enrolled.includes(req.user.id)) {
    return res.status(400).json({ message: 'Already enrolled' });
  }

  course.enrolled.push(req.user.id);
  await course.save();

  res.json({ message: 'Enrolled successfully', course });
});

// ✅ Get all enrolled courses for logged-in student
router.get('/enrolled/me', protect, async (req, res) => {
  if (req.user.type !== 'student') {
    return res.status(403).json({ message: 'Only students can view enrolled courses' });
  }

  const courses = await Course.find({ enrolled: req.user.id });
  res.json(courses);
});

// ✅ Get single course by ID
router.get('/:id', protect, async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });

  res.json(course);
});

export default router;
