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

const orderCreationEmail = async (
    sellerEmail,
    type,
    weight,
    amount,
    name,
    address,
    phone,
    role
  ) => {
  return new Promise(async (resolve, reject) => {
    try {
      const emailContent = `
        <h1>Hello from Avocet - Your order has been sent to:</h1>
        <p>Name: ${name}</p>
        <p>Role: ${role} kg</p>
        <p>Address: ${address}</p>
        <p>Amount: # ${amount}</p>
        <p>Phone: ${phone}</p>
      `;

      console.log(emailContent)

      const mailOptions = {
        from: 'avocetsolutions@outlook.com',
        to: sellerEmail,
        subject: `Your Avocet Order ${type} - ${weight}kg was created`,
        html: emailContent,
      };

      await transporter.sendMail(mailOptions);

      console.log("Order creation Email sent to the seller");
      
      resolve();
    } catch (error) {
      console.error("Error sending email to seller:", error);
      reject(error);
    }
  });
};

module.exports = orderCreationEmail;
