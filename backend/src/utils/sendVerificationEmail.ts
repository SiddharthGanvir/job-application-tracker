import axios from "axios";

export async function sendVerificationEmail(
  email: string,
  token: string
) {
  const verificationLink =
    `${process.env.BACKEND_URL}/api/auth/verify/${token}`;

  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Career Flow",
          email: "siddharthganvir01@gmail.com",
        },

        to: [
          {
            email: email,
          },
        ],

        subject: "Verify Your Career Flow Account",

        htmlContent: `
          <h2>Welcome to Career Flow</h2>

          <p>Click the button below to verify your email.</p>

          <p>
            <a href="${verificationLink}">
              Verify Email
            </a>
          </p>
        `,
      },
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "api-key": process.env.BREVO_API_KEY!,
        },
        timeout: 10000,
      }
    );

    console.log("✅ Verification email sent successfully.");
  } catch (error: any) {
    console.error(
      "❌ Error sending verification email:"
    );

    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }

    throw error;
  }
}