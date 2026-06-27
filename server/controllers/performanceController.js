import asyncHandler from "express-async-handler";
import Performance from "../models/performanceModel.js";

// @desc    Get all product performance data
// @route   GET /api/performance
// @access  Private/Admin
const getPerformanceData = asyncHandler(async (req, res) => {
  try {
    const data = await Performance.find({});
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500);
    throw new Error("Failed to fetch performance data");
  }
});

export { getPerformanceData };
