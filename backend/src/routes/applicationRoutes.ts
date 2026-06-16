import express from "express";

import { createApplication }
from "../controllers/applicationController";

import {
  authenticateToken,
} from "../middleware/authMiddleware";

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  createApplication
);

export default router;