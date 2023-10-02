const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  auth: {
    user: 'avocetsolutions@outlook.com',
    pass: 'amee#98R',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendEmailToAdmin = async (email, status) => {
  try {
    const emailContent = `
      <h1>Hello Admin</h1>
      <p>An order has been processed, please log in to confirm and process the payment.</p>
    `;

    const mailOptions = {
      from: 'avocetsolutions@outlook.com',
      to: email,
      subject: `An Avocet Order status changed to ${status}`,
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);

    console.log(`Order upgrade email sent to the Admin: ${email}`);
  } catch (error) {
    console.error("Error sending email to Admin:", error);
    throw error; 
  }
};

module.exports = sendEmailToAdmin;
