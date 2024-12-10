const nodemailer = require('nodemailer');

const sentEmail = async (options) => {
  /// steps
  //  1) create a transporter \
  // const transporter = nodemailer.createTransport({
  //   service: 'Gmail', // service used to send email
  //   auth: {
  //     user: process.env.EMAIL_USERNAME,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  // after this in your gmail account ... activate the "less secure app" option
  // using mailtrapper
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //  2) define the email option
  const mailOption = {
    from: 'Ujjwal baranwal <god.slayer.2315@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html
  };
  //  3) actually send the email
  await transporter.sendMail(mailOption);
};

module.exports = sentEmail;
