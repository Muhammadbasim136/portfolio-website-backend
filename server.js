const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(cors(
  {origin: "https://tech-spire.netlify.app"}
));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend Working");
});

app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const emailPromise = transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Message From ${name}`,
      html: `
        <h2>Portfolio Contact Form</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `
    });
    // const whatsappText = `New Portfolio Contact\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;
    // const whatsappUrl = `https://api.textmebot.com/send.php?recipient=${encodeURIComponent(process.env.WHATSAPP_PHONE)}&apikey=${process.env.WHATSAPP_APIKEY}&text=${encodeURIComponent(whatsappText)}`;
    // const whatsappPromise = fetch(whatsappUrl);

    // const results = await Promise.allSettled([emailPromise, whatsappPromise]);

        const results = await Promise.allSettled([emailPromise]);


    results.forEach((result, i) => {
      if (result.status === "rejected") {
        console.log(i === 0 ? "Email failed:" : "WhatsApp failed:", result.reason);
      }
    });

    res.json({ success: true });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});