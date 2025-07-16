import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const { GMAIL_USER, GMAIL_PASS } = process.env;

if (!GMAIL_USER || !GMAIL_PASS) {
    throw new Error('GMAIL_USER and GMAIL_PASS must be set in environment variables');
}

export async function sendMail({ subject, body, to, consoleMessage }: { subject: string; body: string; to: string; consoleMessage?: string }) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: GMAIL_USER,
            pass: GMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const mailOptions = {
        from: GMAIL_USER,
        to,
        subject,
        html: body,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        if (consoleMessage) {
            console.log(consoleMessage);
        }
        return info;
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
}
