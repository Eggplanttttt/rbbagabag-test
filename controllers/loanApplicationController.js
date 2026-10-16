const validate = require("../validators/loanApplication");
const Application = require("../models/loanApplicationModel");

exports.submit = async function (req, res) {
    res.set("Cache-Control", "no-store");
    let data;
    try { data = validate(req.body); }
    catch (error) { return res.status(422).json({ error: error.message }); }
    try {
        await Application.create(data);
        return res.status(201).json({ saved: true });
    } catch (error) {
        if (error.code === "APPLICATION_ALREADY_SUBMITTED") {
            return res.status(409).json({ error: "This application has already been submitted. A duplicate application was not saved. Please contact the bank if you need to update your application." });
        }
        console.error("Loan application save failed:", error.code || "database error");
        return res.status(503).json({ error: "Your application could not be saved. Please try again or contact the bank." });
    }
};
