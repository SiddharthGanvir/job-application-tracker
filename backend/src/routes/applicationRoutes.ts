import express from "express";

import {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication,
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

router.delete(
  "/:id",
  authenticateToken,
  deleteApplication
);

export default router;