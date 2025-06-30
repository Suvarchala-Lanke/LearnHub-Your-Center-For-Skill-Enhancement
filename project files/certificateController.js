// controllers/certificateController.js
// controllers/certificateController.js
import PDFDocument from 'pdfkit';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import CompletedLesson from '../models/CompletedLesson.js';

export const generateCertificate = async (req, res) => {
  const userId = req.user._id;
  const { courseId } = req.params;

  try {
    console.log("📥 Certificate request received for Course:", courseId, "by User:", userId);

    // 1. Fetch user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.type !== 'student') return res.status(403).json({ message: 'Only students can download certificates' });

    // 2. Fetch course
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // ✅ FIXED: Check enrollment using Course.enrolled array
    const isEnrolled = course.enrolled?.some(
      (enrolledId) => enrolledId.toString() === userId.toString()
    );

    if (!isEnrolled) {
      console.log("❌ User is not enrolled in this course (Course.enrolled check)");
      return res.status(403).json({ message: 'User not enrolled in this course' });
    }

    // 3. Check if all lessons completed
    const totalLessons = await Lesson.find({ courseID: courseId });
    const completedLessons = await CompletedLesson.find({ courseId, userId });

    console.log(`📘 Total Lessons: ${totalLessons.length}, ✅ Completed: ${completedLessons.length}`);

    if (completedLessons.length < totalLessons.length) {
      return res.status(400).json({ message: 'All lessons not completed' });
    }

    // 4. Generate PDF Certificate
    const doc = new PDFDocument();
    let buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=certificate.pdf',
        'Content-Length': pdfData.length,
      });
      res.end(pdfData);
    });

    // 📜 Certificate Content
    doc.fontSize(25).text('Certificate of Completion', { align: 'center' });
    doc.moveDown();
    doc.fontSize(18).text(`Awarded to: ${user.name}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`For successfully completing the course:`, { align: 'center' });
    doc.fontSize(20).text(`${course.C_title}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });

    doc.end();
    console.log("✅ Certificate generated and sent to browser");

  } catch (err) {
    console.error("❌ Certificate generation failed:", err.message);
    res.status(500).json({ message: 'Error generating certificate' });
  }
};
