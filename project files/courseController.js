// controllers/courseController.js
import Course from '../models/Course.js';

export const getAllCourses = async (req, res) => {
  const { search } = req.query;
  const userId = req.user.id; // We get this because 'protect' middleware is used

  try {
    const regex = new RegExp(search || '', 'i');

    const courses = await Course.find({
      C_title: { $regex: regex },
    });

    const result = courses.map((course) => {
      const totalLessons = course.lessons?.length || 0;
      const completedCount = course.completedLessons?.[userId]?.length || 0;

      return {
        ...course._doc,
        totalLessons,
        completedCount,
      };
    });

    res.status(200).json(result);
  } catch (err) {
    console.error('❌ Error fetching courses:', err);
    res.status(500).json({ message: 'Error fetching courses' });
  }
};
