

const Inquiry = require("../models/inquiryModel");

function renderContact(res, status, extra) {
    res.status(status).render("contact", Object.assign({
        title: "Rural Bank of Bagabag | Contact Us",
        description: "Contact Rural Bank of Bagabag (N.V.), Inc. at 65A National Highway, San Pedro, Bagabag, Nueva Vizcaya. Call, email, or send an inquiry.",
        pageCss: ["contact"],
        values: { name: "", email: "", subject: "", message: "" },
        errors: {},
        status: null
    }, extra));
}

exports.show = function (req, res) {
    const subject = String(req.query.subject || "").slice(0, 150);
    const sent = req.query.sent === "1";

    renderContact(res, 200, {
        values: { name: "", email: "", subject: subject, message: "" },
        status: sent ? { type: "ok", text: "Thank you! Your message was sent. We will get back to you soon." } : null
    });
};

exports.submit = async function (req, res) {
    const data = Inquiry.clean(req.body);

    if (data.website) { return res.redirect(303, "/contact?sent=1"); }

    const errors = Inquiry.validate(data);
    if (Object.keys(errors).length > 0) {
        return renderContact(res, 422, {
            values: data,
            errors: errors,
            status: { type: "error", text: "Please fix the highlighted fields and try again." }
        });
    }

    try {
        await Inquiry.send(data);
        return res.redirect(303, "/contact?sent=1");
    } catch (error) {
        console.error("Contact form email failed:", error.code || error.message);
        return renderContact(res, 502, {
            values: data,
            status: {
                type: "error",
                text: "Sorry, we could not send your message right now. Please call us or email us directly using the contact details on this page."
            }
        });
    }
};
