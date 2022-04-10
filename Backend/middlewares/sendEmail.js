const nodemailer=require("nodemailer");

exports.sendEmail=async (options) => {
    var transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "8a961f39aad0f5",
          pass: "795daf73cfce08"
        }
      });

    const mailOptions = {
        from:process.env.SMPT_MAIL,
        to:options.email,
        subject:options.subject,
        text:options.message,
    }

    await transporter.sendMail(mailOptions);
}