import express from "express";
import { getPerformanceData } from "../controllers/performanceController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(admin);

/**
 * @swagger
 * /api/performance:
 *   get:
 *     summary: Get product performance data
 *     tags: [Performance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Performance data retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get("/", getPerformanceData);

export default router;
