import nodeMailer from "nodemailer";

let adminEmail = process.env.MAIL_USER;
let adminPassword = process.env.MAIL_PASSWORD;
let mailHost = process.env.MAIL_HOST;
let mailPort = process.env.MAIL_PORT;
/**
 * 
 * @param {to} to gửi cho ai 
 * @param {subject} subject chủ đề mail
 * @param {htmlContent} htmlContent nội dung mail
 * @returns 
 */
let sendMail = (to, subject, htmlContent) => {
  let transporter = nodeMailer.createTransport({
    host: mailHost,
    port: mailPort,
    secure: false, // use SSL - TLS
    auth: {
      user: adminEmail,
      pass: adminPassword
    }
  });

  let option = {
    from: adminEmail,
    to: to,
    subject: subject,
    html: htmlContent
  };

  return transporter.sendMail(option); // This default return a  promise
};

module.exports = sendMail;
