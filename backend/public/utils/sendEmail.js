"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Configure Sendgrid API Key if available
if (process.env.SENDGRID_API_KEY) {
    mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
}
const sendEmail = async (options) => {
    console.log("options", options);
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
        console.log("msg data", msg);
        try {
            await mail_1.default.send(msg);
            console.log(`Email sent successfully via SendGrid to ${options.email}`);
            return;
        }
        catch (error) {
            console.error("SendGrid failed to send:", error);
            if (error.response) {
                console.error(error.response.body);
            }
            throw new Error("SendGrid email could not be sent");
        }
    }
    else {
        // Fallback to Nodemailer (Gmail or Mailtrap) locally
        const transporter = nodemailer_1.default.createTransport({
            service: process.env.SMTP_SERVICE || "gmail",
            auth: {
                user: process.env.SMTP_EMAIL || "test@example.com",
                pass: process.env.SMTP_PASSWORD || "password",
            },
        });
        console.log("transporter", transporter);
        const mailOptions = {
            from: `"${process.env.FROM_NAME || 'YouTube Clone'}" <${process.env.SMTP_EMAIL || 'test@example.com'}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
        };
        console.log("mailOptions", mailOptions);
        try {
            await transporter.sendMail(mailOptions);
            console.log(`Email sent successfully via Nodemailer to ${options.email}`);
        }
        catch (error) {
            console.error("Nodemailer failed to send:", error);
            throw new Error("Nodemailer email could not be sent");
        }
    }
};
exports.default = sendEmail;
