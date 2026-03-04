import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import {
  getCourseStudents,
  getInstructorEarnings,
  getInstructorEnrollments,
  getInstructorRevenue,
} from "../controllers/instructor.controller.js";

const router = express.Router();

// Instructor access only
router.use(authMiddleware, roleMiddleware("instructor"));

// Courses

// Students

router.get("/revenue", getInstructorRevenue);
router.get("/enrollments", getInstructorEnrollments);
router.get("/earnings", getInstructorEarnings);
router.get("/course/:id/students", getCourseStudents);

// Earnings

export default router;
