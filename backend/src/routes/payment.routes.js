import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  generateClientToken,
  createTransaction,
  refundPayment,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.get("/token", authMiddleware, generateClientToken);
router.post("/checkout", authMiddleware, createTransaction);
router.post("/refund", authMiddleware, refundPayment);

export default router;
