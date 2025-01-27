import nodemailer from "nodemailer";
export const sendEmail = async ({ to, subject, text }) => {
  // sender
  const transporter = nodemailer.createTransport({
    host: "localhost",
    port: 587,
    secure: false,
    service:'gmail',
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  //reciver
  const mail = await transporter.sendMail({
    from: `"IEEE Web Master Team " <${process.env.USER}> `,
    to,
    subject,
    text,
  });
  if (mail.rejected.length > 0) return false;
  return true;
};
