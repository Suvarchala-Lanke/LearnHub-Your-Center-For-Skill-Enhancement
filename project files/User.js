// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  type: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student'
  },

  // ✅ NEW: List of enrolled courses
  enrolledCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  }],

  // ✅ Already present: Completed lessons per course
  completedLessons: [
    {
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      },
      lessons: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Lesson'
        }
      ]
    }
  ]
});

const User = mongoose.model('User', userSchema);
export default User;
