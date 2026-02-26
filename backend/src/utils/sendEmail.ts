import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

interface EmailOptions {
    email: string;
    subject: string;
    message: string;
}

const sendEmail = async (options: EmailOptions) => {
    const transporter = nodemailer.createTransport({
        // You can use any service you like, like gmail, mailtrap, sendgrid, etc.
        service: process.env.SMTP_SERVICE || "gmail",
        auth: {
            user: process.env.SMTP_EMAIL || "test@example.com",
            pass: process.env.SMTP_PASSWORD || "password",
        },
    });

    const mailOptions = {
        from: `"${process.env.FROM_NAME || 'YouTube Clone'}" <${process.env.SMTP_EMAIL || 'test@example.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(mailOptions);
};

export default sendEmail;
