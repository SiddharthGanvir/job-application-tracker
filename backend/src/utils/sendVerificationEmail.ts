import nodemailer from "nodemailer";

export const sendVerificationEmail =
  async (
    email: string,
    token: string
  ) => {

    const transporter =
      nodemailer.createTransport({
        service: "gmail",
        auth: {
          user:
            process.env.EMAIL_USER,
          pass:
            process.env.EMAIL_PASS,
        },
      });

    const verificationLink =
  `${process.env.BACKEND_URL}/api/auth/verify/${token}`;

   try {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
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