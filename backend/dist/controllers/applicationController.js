"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteApplication = exports.updateApplication = exports.getApplications = exports.createApplication = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createApplication = async (req, res) => {
    try {
        const { companyName, role, status, platform, jobLink, applicationDate, } = req.body;
        if (!companyName?.trim() ||
            !role?.trim() ||
            !status?.trim() ||
            !platform?.trim() ||
            !jobLink?.trim()) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }
        const application = await prisma_1.default.jobApplication.create({
            data: {
                companyName,
                role,
                status,
                platform,
                jobLink,
                applicationDate: new Date(applicationDate),
                userId: req.userId,
            },
        });
        return res.status(201).json({
            message: "Application created successfully",
            application,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server Error",
        });
    }
};
exports.createApplication = createApplication;
const getApplications = async (req, res) => {
    try {
        const applications = await prisma_1.default.jobApplication.findMany({
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server Error",
        });
    }
};
exports.getApplications = getApplications;
const updateApplication = async (req, res) => {
    try {
        const applicationId = Number(req.params.id);
        const { companyName, role, status, platform, jobLink, applicationDate, } = req.body;
        const application = await prisma_1.default.jobApplication.findUnique({
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
        const updatedApplication = await prisma_1.default.jobApplication.update({
            where: {
                id: applicationId,
            },
            data: {
                companyName,
                role,
                status,
                platform,
                jobLink,
                applicationDate: new Date(applicationDate),
            },
        });
        return res.status(200).json({
            message: "Application updated successfully",
            updatedApplication,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server Error",
        });
    }
};
exports.updateApplication = updateApplication;
const deleteApplication = async (req, res) => {
    try {
        const applicationId = Number(req.params.id);
        const application = await prisma_1.default.jobApplication.findUnique({
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
        await prisma_1.default.jobApplication.delete({
            where: {
                id: applicationId,
            },
        });
        return res.status(200).json({
            message: "Application deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server Error",
        });
    }
};
exports.deleteApplication = deleteApplication;
