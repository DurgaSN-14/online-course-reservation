import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import {
  getCourseStudents,
  getInstructorDashboardStats,
  getInstructorEarnings,
  getInstructorEnrollments,
  getInstructorRevenue,
  getInstructorStudents,
  getNotifications,
  globalSearch,
  markNotificationsRead,
} from "../controllers/instructor.controller.js";

const router = express.Router();

// Instructor access only
router.use(authMiddleware, roleMiddleware("instructor"));

router.get("/revenue", getInstructorRevenue);
router.get("/enrollments", getInstructorEnrollments);
router.get("/earnings", getInstructorEarnings);

router.get("/stats", getInstructorDashboardStats);
router.get("/my-students", getInstructorStudents);
router.get("/search", authMiddleware, globalSearch);
router.get("/notifications", authMiddleware, getNotifications);
router.patch("/notifications/mark-read", authMiddleware, markNotificationsRead); // Mark all
router.patch(
  "/notifications/mark-read/:id",
  authMiddleware,
  markNotificationsRead,
); // Mark one

router.get("/course/:id/students", getCourseStudents);

export default router;
