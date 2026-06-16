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

export const getApplications = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const applications =
      await prisma.jobApplication.findMany({
        where: {
          userId: req.userId,
        },
        orderBy: {
          applicationDate: "desc",
        },
      });

    return res.status(200).json({
      applications,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

export const updateApplication = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const applicationId = Number(req.params.id);

    const { status } = req.body;

    const application =
      await prisma.jobApplication.findUnique({
        where: {
          id: applicationId,
        },
      });

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (application.userId !== req.userId) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    const updatedApplication =
      await prisma.jobApplication.update({
        where: {
          id: applicationId,
        },
        data: {
          status,
        },
      });

    return res.status(200).json({
      message:
        "Application updated successfully",
      updatedApplication,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};