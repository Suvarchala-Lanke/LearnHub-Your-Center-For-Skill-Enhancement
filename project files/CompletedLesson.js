// models/CompletedLesson.js
import mongoose from 'mongoose';

const completedLessonSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

const CompletedLesson = mongoose.model('CompletedLesson', completedLessonSchema);

export default CompletedLesson;
