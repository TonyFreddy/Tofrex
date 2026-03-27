const nodemailer = require("nodemailer");
const { ENV } = require("./env");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ENV.EMAIL_USER,
    pass: ENV.EMAIL_PASS,
  },
});

const sender = {
  email: ENV.EMAIL_FROM,
  name: ENV.EMAIL_FROM_NAME,
};

module.exports = { transporter, sender };