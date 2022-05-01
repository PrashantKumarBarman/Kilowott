"use strict";
const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // generated ethereal user
      pass: process.env.SMPT_PASSWORD // generated ethereal password
    }
});

async function sendMail(to: string, content: string, contentType: 'html'|'text' = 'text', subject: string = '') {
  try {
    let infoObj = {
        from: process.env.SMPT_FROM_EMAIL, // sender address
        to: 'prashantkumarbarman@gmail.com', // list of receivers
        subject: subject, // Subject line
        html: contentType === 'html' ? content : null,
        text: contentType === 'text' ? content : null
    };
    // send mail with defined transport object
    let info = await transporter.sendMail(infoObj);
    console.log(info);
  }
  catch(err) {
      console.log(err);
  }
}

export { sendMail };
