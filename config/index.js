
if (typeof process.loadEnvFile === "function") {
    try { process.loadEnvFile(); } catch (error) {  }
}

const siteModel = require("../models/siteModel");

module.exports = {
    isProduction: process.env.NODE_ENV === "production",
    port: process.env.PORT || 3000,

    mail: {
        host: process.env.SMTP_HOST || "",
        port: Number(process.env.SMTP_PORT || 465),
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASS || "",
        to: process.env.CONTACT_TO || siteModel.bankInfo.formRecipientEmail
    }
};
