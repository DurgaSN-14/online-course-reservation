import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  reserveCourse,
  getMyReservations,
  cancelReservation,
} from "../controllers/reservation.controller.js";

const router = express.Router();

router.post("/", authMiddleware, reserveCourse);

router.get("/my", authMiddleware, getMyReservations);

router.delete("/:courseId", authMiddleware, cancelReservation);

export default router;
