const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS.replace(/\s/g, ""), // Remove all spaces
      },
    });

    const info = await transporter.sendMail({
      from: `"Forum App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent successfully:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
    console.error("Full error:", err);
    throw err;
  }
};

module.exports = sendEmail;
