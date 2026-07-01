import nodemailer from "nodemailer";

export const sendVerificationEmail =
  async (
    email: string,
    token: string
  ) => {
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});
    const verificationLink =
  `${process.env.BACKEND_URL}/api/auth/verify/${token}`;

   try {
  await transporter.sendMail({
   from: `"Career Flow" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify Your Email",
    html: `
      <h2>Welcome to Career Flow</h2>

      <p>
        Click the button below to verify your email:
      </p>

      <a href="${verificationLink}">
        Verify Email
      </a>
    `,
  });

  console.log("✅ Verification email sent successfully.");

} catch (error) {
  console.error("❌ Error sending verification email:", error);
  throw error;
} 
  };