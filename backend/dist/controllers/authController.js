"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profile = exports.verifyEmail = exports.login = exports.register = void 0;
const crypto_1 = __importDefault(require("crypto"));
const sendVerificationEmail_1 = require("../utils/sendVerificationEmail");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../config/prisma"));
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name?.trim() ||
            !email?.trim() ||
            !password?.trim()) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format",
            });
        }
        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters",
            });
        }
        // Check existing user
        const existingUser = await prisma_1.default.user.findUnique({
            where: {
                email,
            },
        });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered",
            });
        }
        // Hash password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const verificationToken = crypto_1.default.randomBytes(32).toString("hex");
        // Create user
        const user = await prisma_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                verificationToken,
                isVerified: false,
            },
        });
        await (0, sendVerificationEmail_1.sendVerificationEmail)(email, verificationToken);
        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server Error",
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email?.trim() ||
            !password?.trim()) {
            return res.status(400).json({
                message: "Email and Password are required",
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format",
            });
        }
        const user = await prisma_1.default.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }
        if (!user.isVerified) {
            return res.status(400).json({
                message: "Please verify your email before logging in",
            });
        }
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
        }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        return res.status(200).json({
            message: "Login successful",
            token,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server Error",
        });
    }
};
exports.login = login;
const verifyEmail = async (req, res) => {
    try {
        const token = req.params.token;
        const user = await prisma_1.default.user.findFirst({
            where: {
                verificationToken: token,
            },
        });
        if (!user) {
            return res.status(400).send("Invalid verification token");
        }
        await prisma_1.default.user.update({
            where: {
                id: user.id,
            },
            data: {
                isVerified: true,
                verificationToken: null,
            },
        });
        return res.send("Email verified successfully! You can now login.");
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Server Error");
    }
};
exports.verifyEmail = verifyEmail;
const profile = async (req, res) => {
    return res.status(200).json({
        userId: req.userId,
    });
};
exports.profile = profile;
