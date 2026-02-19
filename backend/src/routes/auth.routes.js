import express from "express";
import {
  signup,
  login,
  getProfile,
  logout,
  updateProfile,
  changePassword,
  deactivateAccount,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);

router.get("/me", authMiddleware, getProfile);

router.put("/profile", authMiddleware, updateProfile);

router.put("/change-password", authMiddleware, changePassword);

router.put("/deactivate", authMiddleware, deactivateAccount);

export default router;
