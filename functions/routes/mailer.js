const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "oceanacademy.project@gmail.com",
    pass: "hljrhggaiplhhzau", //smtp Password
  },
});

function mailer({
  to = "",
  from = "oceanacademy.project@gmail.com",
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
