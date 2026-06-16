import { Response } from "express";

import prisma from "../config/prisma";
import { AuthRequest } from "../middleware/authMiddleware";

export const createApplication = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      companyName,
      role,
      status,
    } = req.body;

    const application =
      await prisma.jobApplication.create({
        data: {
          companyName,
          role,
          status,
          userId: req.userId!,
        },
      });

    return res.status(201).json({
      message:
        "Application created successfully",
      application,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};