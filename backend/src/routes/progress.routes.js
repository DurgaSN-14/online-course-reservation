import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

import {
  createProgress,
  updateProgress,
  getMyProgress,
  getCourseProgress,
} from "../controllers/progress.controller.js";

const router = express.Router();

// Create progress after purchase
router.post(
  "/create",
  authMiddleware,
  roleMiddleware("student"),
  createProgress,
);

// Update progress
router.patch(
  "/course/:courseId",
  authMiddleware,
  roleMiddleware("student"),
  updateProgress,
);

// Get my progress
router.get(
  "/course/:courseId",
  authMiddleware,
  roleMiddleware("student"),
  getMyProgress,
);

// View students progress
router.get(
  "/course/:courseId/students",
  authMiddleware,
  roleMiddleware("instructor"),
  getCourseProgress,
);

export default router;
