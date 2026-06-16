import express from "express";

import {
  createApplication,
  getApplications,
  updateApplication,
} from "../controllers/applicationController";

import {
  authenticateToken,
} from "../middleware/authMiddleware";

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  createApplication
);

router.get(
  "/",
  authenticateToken,
  getApplications
);

router.put(
  "/:id",
  authenticateToken,
  updateApplication
);

export default router;