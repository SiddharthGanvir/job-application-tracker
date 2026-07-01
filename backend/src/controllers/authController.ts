import crypto from "crypto";
import { sendVerificationEmail } from "../utils/sendVerificationEmail";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

import prisma from "../config/prisma";
import { AuthRequest } from "../middleware/authMiddleware";


export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, email, password } = req.body;

    if (
  !name?.trim() ||
  !email?.trim() ||
  !password?.trim()
) {
  return res.status(400).json({
    message: "All fields are required",
  });
}

const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  return res.status(400).json({
    message: "Invalid email format",
  });
}

if (password.length < 8) {
  return res.status(400).json({
    message:
      "Password must be at least 8 characters",
  });
}

    // Check existing user
    const existingUser = await prisma.user.findUnique({
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
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create user
    const user =
  await prisma.user.create({
    
    data: {
      name,
      email,
      password:
        hashedPassword,

      verificationToken,

      isVerified: false,
    },
  });

  //await sendVerificationEmail(
 // email,
  //verificationToken
//);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};
export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;
    
    if (
  !email?.trim() ||
  !password?.trim()
) {
  return res.status(400).json({
    message:
      "Email and Password are required",
  });
}

const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  return res.status(400).json({
    message: "Invalid email format",
  });
}

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    if (!user.isVerified) {
  return res.status(400).json({
    message:
      "Please verify your email before logging in",
  });
}

    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

export const verifyEmail =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const  token  =
        req.params.token as string;

      const user =
        await prisma.user.findFirst({
          where: {
            verificationToken:
              token,
          },
        });

      if (!user) {
        return res.status(400).send(
          "Invalid verification token"
        );
      }

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          isVerified: true,
          verificationToken: null,
        },
      });

      return res.send(
        "Email verified successfully! You can now login."
      );
    } catch (error) {
      console.error(error);

      return res.status(500).send(
        "Server Error"
      );
    }
  };

export const profile = async (
  req: AuthRequest,
  res: Response
) => {
  return res.status(200).json({
    userId: req.userId,
  });
};