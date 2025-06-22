require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route
app.post('/api/contact', async (req, res) => {
  const { fullName, email, phone, company, subject, message } = req.body;

  if (!fullName || !email || !phone || !subject || !message) {
    return res.status(400).json({ error: 'Please fill all required fields.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or your SMTP service
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  const mailOptions = {
      from: `"${fullName} via Contact Form" `,
      to: process.env.MAIL_RECEIVER,
      replyTo: email,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h2>Contact Form Submission</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'Message sent successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
