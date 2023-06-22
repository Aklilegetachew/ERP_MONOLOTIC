const nodemailer = require("nodemailer");
exports.sendEmail = async (req, res, next) => {
    const {firstname, lastname, email, subject,phone, message} = req.body;
    try {
       console.log('got here to send email');
       console.log(process.env.emailUser)
       console.log(process.env.emailPassword)
        
  let transporter = nodemailer.createTransport({
    host: "proplast.et",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.emailUser, // generated ethereal user
      pass: process.env.emailPassword, // generated ethereal password
    },
  });
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"${firstname} ${lastname}" <${email}>`, // sender address
        to: "contact@proplast.et", // list of receivers
        subject: "Message from your website", // Subject line
        text: `${message}`, // plain text body
        html: `<html>
        <head>
        <meta name="viewport" content="width=device-width" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        </head>
        <body>
        <table bgcolor="#fafafa" style=" width: 100%!important; height: 100%; background-color: #fafafa; padding: 20px; font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, 'Lucida Grande', sans-serif;  font-size: 100%; line-height: 1.6;">
        <tr>
        <td></td>
        <td bgcolor="#FFFFFF" style="border: 1px solid #eeeeee; background-color: #ffffff; border-radius:5px; display:block!important; max-width:600px!important; margin:0 auto!important; clear:both!important;"><div style="padding:20px; max-width:600px; margin:0 auto; display:block;">
        <table style="width: 100%;">
        <tr>
        <td><p style="text-align: center; display: block;  padding-bottom:20px;  margin-bottom:20px; border-bottom:1px solid #dddddd;">A users has sent a message for you on the contact us page.</p>
        <h1 style="font-weight: bold; font-size: 16px; margin: 20px 0 30px 0; color: #333333;">Subject: ${subject}</h1>
        <p style="margin-bottom: 10px; font-weight: bold; font-size:16px; color: #333333;">Message</p>
        <p style="margin-bottom: 10px; font-weight: normal; font-size:16px; color: #333333;">Message${message}</p>
        <h2 style="font-weight: 200; font-size: 16px; margin: 20px 0; color: #333333;"> Name : ${firstname} ${lastname} </h2>
        <h2 style="font-weight: 200; font-size: 16px; margin: 20px 0; color: #333333;"> Email : ${email}  </h2>
        <h2 style="font-weight: 200; font-size: 16px; margin: 20px 0; color: #333333;"> Phone : ${phone}  </h2>
        <p style="text-align: center; display: block; padding-top:20px; font-weight: bold; margin-top:30px; color: #666666; border-top:1px solid #dddddd;">Proplast</p></td>
        </tr>
        </table>
        </div></td>
        <td></td>
        </tr>
        </table>
        </body>
        </html>`, // html body
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
  