import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

import {
  issueCertificate,
  getMyCertificates,
  verifyCertificate,
} from "../controllers/certificate.controller.js";

const router = express.Router();

// Issue certificate
router.post(
  "/course/:courseId",
  authMiddleware,
  roleMiddleware("student"),
  issueCertificate,
);

// Get my certificates
router.get("/my", authMiddleware, roleMiddleware("student"), getMyCertificates);

// Verify certificate
router.get("/verify/:certificateId", verifyCertificate);

export default router;
