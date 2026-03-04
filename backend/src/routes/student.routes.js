import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import {
  getMyCourses,
  getMyPayments,
  getPaymentById,
} from "../controllers/student.controller.js";

const router = express.Router();

// Student access only
router.use(authMiddleware, roleMiddleware("student"));

// Courses
router.get("/courses", getMyCourses);

// Reservations

// Payments
router.get("/payments", getMyPayments);
router.get("/payment/:id", getPaymentById);

export default router;
