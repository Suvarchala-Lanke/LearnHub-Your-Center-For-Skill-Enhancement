import Lesson from '../models/Lesson.js';

export const getLessonsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const lessons = await Lesson.find({ courseId });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch lessons' });
  }
};

export const addLesson = async (req, res) => {
  try {
    const { courseId, L_title, L_content } = req.body;
    if (!courseId || !L_title || !L_content) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newLesson = new Lesson({ courseId, L_title, L_content });
    await newLesson.save();

    res.status(201).json({ message: 'Lesson added successfully', lesson: newLesson });
  } catch (error) {
    res.status(500).json({ message: 'Error adding lesson' });
  }
};

// ✏️ Update Lesson
export const updateLesson = async (req, res) => {
  const { id } = req.params;
  const { L_title, L_content } = req.body;
  try {
    const lesson = await Lesson.findById(id);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    lesson.L_title = L_title || lesson.L_title;
    lesson.L_content = L_content || lesson.L_content;
    await lesson.save();

    res.json({ message: 'Lesson updated', lesson });
  } catch (error) {
    res.status(500).json({ message: 'Error updating lesson' });
  }
};

// ❌ Delete Lesson
export const deleteLesson = async (req, res) => {
  const { id } = req.params;
  try {
    const lesson = await Lesson.findById(id);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    await lesson.deleteOne();
    res.json({ message: 'Lesson deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting lesson' });
  }
};
