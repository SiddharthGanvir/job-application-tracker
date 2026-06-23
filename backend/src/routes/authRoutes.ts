import express from "express";
import {
  register,
  login,
  profile,
  verifyEmail
} from "../controllers/authController";

import {
  authenticateToken,
} from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get(
  "/verify/:token",
  verifyEmail
);
router.get(
  "/profile",
  authenticateToken,
  profile
);

export default router;