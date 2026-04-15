const { transporter, sender } = require("../lib/nodemailer");
const { createWelcomeEmailTemplate } = require("./emailTemplates");

const sendWelcomeEmail = async (email, name, clientURL) => {
  try {
    await transporter.sendMail({
      from: `${sender.name} <${sender.email}>`,
      to: email,
      subject: "Welcome to Chatify!",
      html: createWelcomeEmailTemplate(name, clientURL),
    });
    console.log("Welcome email sent to:", email);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }
};

module.exports = { sendWelcomeEmail };