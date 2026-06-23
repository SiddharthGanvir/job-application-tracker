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
      `http://localhost:5000/api/auth/verify/${token}`;

    await transporter.sendMail({
      from:
        process.env.EMAIL_USER,
      to: email,
      subject:
        "Verify Your Email",
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