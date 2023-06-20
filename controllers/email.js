const nodemailer = require("nodemailer");
exports.sendEmail = async (req, res, next) => {
    const {firstname, lastname, email, phone, message} = req.body;
    try {
        let testAccount = await nodemailer.createTestAccount();
        // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"${firstname} ${lastname}" <${email}>`, // sender address
        to: "nfeleke568@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: `${message}`, // plain text body
        html: `<b>${message}</b>`, // html body
      });
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      return res.status(200).send('Email sent')
    } catch (error) {
        console.log(error)
       return res.status(500).send('Server Error.')
    }
  };
  