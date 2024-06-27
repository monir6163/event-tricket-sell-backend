const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.USER_MAIL,
    pass: process.env.USER_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  }, // Use `true` for port 465, `false` for all other ports
});

const sendMail = async (email, subject, text) => {
  try {
    let mailOptions = {
      from: '"Event Management System" <' + process.env.USER_MAIL + ">", // sender address
      to: email,
      subject: subject,
      html: text,
    };
    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log("error", error);
  }
};

module.exports = sendMail;
