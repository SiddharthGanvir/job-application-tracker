"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendVerificationEmail = async (email, token) => {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const verificationLink = `http://localhost:5000/api/auth/verify/${token}`;
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify Your Email",
        html: `
        <h2>Welcome to Job Application Tracker</h2>

        <p>
          Click the button below to verify your email:
        </p>

        <a
          href="${verificationLink}"
        >
          Verify Email
        </a>
      `,
    });
};
exports.sendVerificationEmail = sendVerificationEmail;
