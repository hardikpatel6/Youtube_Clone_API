import nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

// Configure Sendgrid API Key if available
if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface EmailOptions {
    email: string;
    subject: string;
    message: string;
}

const sendEmail = async (options: EmailOptions) => {
    console.log("options",options);
    // Determine whether to use SendGrid or Nodemailer
    if (process.env.SENDGRID_API_KEY) {
        // Use SendGrid
        const msg = {
            to: options.email,
            // Assuming SMTP_EMAIL is verified in SendGrid or SENDGRID_FROM_EMAIL is set
            from: process.env.SENDGRID_FROM_EMAIL || process.env.SMTP_EMAIL || "test@example.com",
            subject: options.subject,
            text: options.message,
            html: options.message.replace(/\n\n/g, "<br><br>").replace(/\n/g, "<br>"), // Format lines for HTML
        };
        console.log("msg data",msg);
        try {
            await sgMail.send(msg);
            console.log(`Email sent successfully via SendGrid to ${options.email}`);
            return;
        } catch (error: any) {
            console.error("SendGrid failed to send:", error);
            if (error.response) {
                console.error(error.response.body);
            }
            throw new Error("SendGrid email could not be sent");
        }
    } else {
        // Fallback to Nodemailer (Gmail or Mailtrap) locally
        const transporter = nodemailer.createTransport({
            service: process.env.SMTP_SERVICE || "gmail",
            auth: {
                user: process.env.SMTP_EMAIL || "test@example.com",
                pass: process.env.SMTP_PASSWORD || "password",
            },
        });
        console.log("transporter",transporter);
        const mailOptions = {
            from: `"${process.env.FROM_NAME || 'YouTube Clone'}" <${process.env.SMTP_EMAIL || 'test@example.com'}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
        };
        console.log("mailOptions",mailOptions);
        try {
            await transporter.sendMail(mailOptions);
            console.log(`Email sent successfully via Nodemailer to ${options.email}`);
        } catch (error) {
            console.error("Nodemailer failed to send:", error);
            throw new Error("Nodemailer email could not be sent");
        }
    }
};

export default sendEmail;
