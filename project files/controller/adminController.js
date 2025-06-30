// controllers/adminController.js
import User from '../models/User.js';

export const getAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
};

export const promoteToTeacher = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.type = 'teacher';
  await user.save();
  res.json({ message: 'User promoted to teacher' });
};
