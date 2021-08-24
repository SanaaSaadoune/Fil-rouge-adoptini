const nodemailer = require("nodemailer");
const config = require("../configs/auth.config");

const user = config.user;
const pass = config.pass;

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: user,
    pass: pass,
  },
});

exports.sendConfirmationEmail = (name, email, confirmationCode, type) => {

    transport.sendMail({
      from: user,
      to: email,
      subject: "Please confirm your account",
      html: `<h1>Email Confirmation</h1>
          <h2>Hello ${name}</h2>
          <p>Thank you for registring. Please confirm your email by clicking on the following link</p>
          <a href=http://localhost:8080/${type}/confirm/${confirmationCode}> Click here</a>
          </div>`,
    }).then(() => console.log("email sended")).catch(err => console.log(err));
  };