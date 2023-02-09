const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "oceanacademypuducherry@gmail.com",
    pass: "kndyaofbgwibspus", //smtp Password
  },
});

function mailer({
  to = "",
  from = "oceanacademypuducherry@gmail.com",
  subject = "Welcome to Ocean Academy",
  content = "Hi There!\n\tWelcome to Ocean Academy",
  responseMailer = () => {},
}) {
  const mailOptions = {
    from: from,
    to: to,
    subject: subject,
    text: content,
  };
  transporter.sendMail(mailOptions, responseMailer);
}

module.exports = mailer;
