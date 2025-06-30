// routes/certificateRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { generateCertificate } from '../controllers/certificateController.js';

const router = express.Router();

// ✅ Protect this route and call the controller to generate/download certificate
router.get('/:courseId', protect, generateCertificate);

export default router;
