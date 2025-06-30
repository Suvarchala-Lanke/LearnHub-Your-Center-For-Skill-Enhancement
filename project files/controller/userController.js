import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Register a new user
export const registerUser = async (req, res) => {
  const { name, email, password, type } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, type });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: 'Error registering user' });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    const isValid = user && await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, type: user.type }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Login error' });
  }
};

// Get logged-in user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

// ✅ Mark a lesson as completed
export const markLessonCompleted = async (req, res) => {
  const userId = req.user._id;
  const { courseId, lessonId } = req.body;

  try {
    const user = await User.findById(userId);

    let courseEntry = user.completedLessons.find(
      (entry) => entry.courseId.toString() === courseId
    );

    if (!courseEntry) {
      courseEntry = {
        courseId,
        lessons: [lessonId]
      };
      user.completedLessons.push(courseEntry);
    } else {
      if (!courseEntry.lessons.includes(lessonId)) {
        courseEntry.lessons.push(lessonId);
      }
    }

    await user.save();
    res.json({ message: 'Lesson marked as completed ✅' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong ❌' });
  }
};

// ✅ Get completed lessons for a course
export const getCompletedLessons = async (req, res) => {
  const userId = req.user._id;
  const { courseId } = req.params;

  try {
    const user = await User.findById(userId);

    const courseEntry = user.completedLessons.find(
      (entry) => entry.courseId.toString() === courseId
    );

    const completedLessons = courseEntry ? courseEntry.lessons : [];
    res.json({ completedLessons });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch completed lessons ❌' });
  }
};

// ✅ NEW: Manually enroll a student in a course (for development use)
export const enrollStudentManually = async (req, res) => {
  const { userId, courseId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.enrolledCourses.includes(courseId)) {
      user.enrolledCourses.push(courseId);
      await user.save();
    }

    res.json({ message: 'User enrolled successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Enrollment failed' });
  }
};
