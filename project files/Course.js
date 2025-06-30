import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  C_educator: String,
  C_categories: String,
  C_title: String,
  C_description: String,
  sections: [String],
  C_price: Number,
  enrolled: [mongoose.Schema.Types.ObjectId],
});

const Course = mongoose.model('Course', courseSchema);
export default Course;