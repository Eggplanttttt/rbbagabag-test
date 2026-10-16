

const nodemailer = require("nodemailer");
const config = require("../config");

const LIMITS = { name: 100, email: 150, subject: 150, message: 3000 };


function oneLine(text) {
    return String(text || "").replace(/[\r\n]+/g, " ").trim();
}

const Inquiry = {
    clean(body) {
        body = body || {};
        return {
            name: oneLine(body.name).slice(0, LIMITS.name),
            email: oneLine(body.email).slice(0, LIMITS.email),
            subject: oneLine(body.subject).slice(0, LIMITS.subject),
            message: String(body.message || "").replace(/\r\n/g, "\n").trim().slice(0, LIMITS.message),
            website: String(body.website || "")   
        };
    },

 
    validate(data) {
        const errors = {};
        if (!data.name) { errors.name = "Please enter your name."; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.email = "Please enter a valid email address, for example name@example.com.";
        }
        if (!data.subject) { errors.subject = "Please enter the subject of your inquiry."; }
        if (!data.message) { errors.message = "Please write your message."; }
        return errors;
    },

    isMailConfigured() {
        return Boolean(config.mail.host && config.mail.user && config.mail.pass);
    },


    async send(data) {
        if (!Inquiry.isMailConfigured()) {
            if (!config.isProduction) {
                console.log("[contact form - email not configured, not sent]\n", data);
                return { sent: false, devOnly: true };
            }
            const error = new Error("Email is not configured");
            error.code = "MAIL_NOT_CONFIGURED";
            throw error;
        }

        const transporter = nodemailer.createTransport({
            host: config.mail.host,
            port: config.mail.port,
            secure: config.mail.port === 465, 
            auth: { user: config.mail.user, pass: config.mail.pass }
        });

        await transporter.sendMail({
            from: "\"Website Inquiry\" <" + config.mail.user + ">",
            to: config.mail.to,
            replyTo: data.name + " <" + data.email + ">",
            subject: "[Website] " + data.subject,
            text: "Name: " + data.name + "\nEmail: " + data.email + "\n\n" + data.message
        });
        return { sent: true };
    }
};

module.exports = Inquiry;
