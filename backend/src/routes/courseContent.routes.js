import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import {
  addCourseContent,
  getCourseContents,
  deleteCourseContent,
  updateCourseContent,
} from "../controllers/courseContent.controller.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("instructor", "admin"),
  addCourseContent,
);

router.get("/:courseId", getCourseContents);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("instructor", "admin"),
  updateCourseContent,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("instructor", "admin"),
  deleteCourseContent,
);

export default router;
