import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

import {
  getAllPayments,
  getAllUsers,
  getAllCourses,
  blockUser,
} from "../controllers/admin.controller.js";

const router = express.Router();

// All admin routes must pass auth + admin role
router.use(authMiddleware, roleMiddleware("admin"));

// Dashboard / Monitoring
router.get("/payments", getAllPayments);
router.get("/users", getAllUsers);
router.get("/courses", getAllCourses);

// Management
router.put("/block-user/:id", blockUser);

export default router;
