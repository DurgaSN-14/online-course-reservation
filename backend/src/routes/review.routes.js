import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

import {
  addReview,
  getCourseReviews,
  deleteReview,
} from "../controllers/review.controller.js";

const router = express.Router();

router.get("/course/:courseId", getCourseReviews);

router.post(
  "/course/:courseId",
  authMiddleware,
  roleMiddleware("student"),
  addReview,
);

router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteReview);

export default router;
