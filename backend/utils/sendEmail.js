const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 5000,
  greetingTimeout: 5000,
  socketTimeout: 5000,
});

const sendEmail = async ({ to, subject, text }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;
