const nodeMailer = require('nodemailer');
 
exports.sendEmail = emailData => {
  const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: 'chilin89117@gmail.com',
      pass: 'jjdsgppjdkaevnic'
    }
  });

  return transporter
    .sendMail(emailData)
    .then(info => console.log(`Message sent: ${info.response}`))
    .catch(err => console.log(`Problem sending email: ${err}`));
};
