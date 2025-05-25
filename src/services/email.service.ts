import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface EmailOptions {
  to: string[];
  subject: string;
  text: string;
  html?: string;
  attachments?: { filename: string; path: string }[];
}

export async function sendEmail(options: EmailOptions) {
  const mailOptions = {
    from: `"Arindam Manna" <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
    attachments: options.attachments,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    // console.log(`Email sent: ${info.response}`);
    return info;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}
