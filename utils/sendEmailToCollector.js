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

const sendEmailToCollector = async (
  _id,
  email, 
  type,
  weight,
  address,
  amount,
  phone,
  status
  ) => {
  return new Promise(async (resolve, reject) => {
    try {
      const emailContent = `
        <h1>An order with id ${_id} was created</h1>
        <p>Type: ${type}</p>
        <p>Weight: ${weight} kg</p>
        <p>Address: ${address}</p>
        <p>Amount: # ${amount}</p>
        <p>Phone: ${phone}</p>
        <p>Status: ${status}</p>
      `;

      console.log(emailContent)

      const mailOptions = {
        from: 'avocetsolutions@outlook.com',
        to: email,
        subject: `An AVOCET order ${user}`,
        html: emailContent,
      };

      await transporter.sendMail(mailOptions);

      console.log("Order creation Email sent to the collector");
      
      resolve();
    } catch (error) {
      console.error("Error sending email to collector:", error);
      reject(error);
    }
  });
};

module.exports = sendEmailToCollector;
