import nodemailer from 'nodemailer';
import { WELCOME_EMAIL_TEMPLATE, NEWS_SUMMARY_EMAIL_TEMPLATE } from "@/lib/nodemailer/templates";
import { getFormattedTodayDate } from "@/lib/utils";

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL!,
        pass: process.env.NODEMAILER_EMAIL_PASSWORD!,
    },


})

export const sendWelcomeEmail = async ({ email, name, intro }: WelcomeEmailData) => {
    const htmlTemplate = WELCOME_EMAIL_TEMPLATE
        .replace('{{name}}', name)
        .replace('{{intro}}', intro);

    const mailOptions = {
        from:process.env.NODEMAILER_EMAIL,
        to: email,
        subject: `Welcome to Marketpulse - your stock market toolkit is ready!`,
        text: 'Thanks for joining Marketpulse',
        html: htmlTemplate,
    }

    await transporter.sendMail(mailOptions);
}

// Local type for daily news email payload
type DailyNewsEmailData = {
    email: string;
    newsHtml: string; // Pre-rendered HTML for the news content section
    date?: string;    // Optional formatted date (e.g., "Thursday, January 1, 2026")
    subject?: string; // Optional custom subject
};

export const sendDailyNewsEmail = async ({ email, date, newsHtml }: DailyNewsEmailData) => {
    const dateString = date || getFormattedTodayDate();

    // Replace all occurrences of placeholders safely
    const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE
        .replace(/\{\{date\}\}/g, dateString)
        .replace(/\{\{newsContent\}\}/g, newsHtml);

    const mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: email,
        subject: `Your Daily Market News Summary — ${dateString}`,
        text: `Today's market news summary from Market pulse`,
        html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
}