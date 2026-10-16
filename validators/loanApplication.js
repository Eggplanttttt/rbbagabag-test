const Loan = require("../models/loanModel");

function validDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(value + "T00:00:00Z");
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value && date.getTime() <= Date.now();
}
module.exports = function validate(input) {
    if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Invalid application.");
    const loan = Loan.all().find(item => item.name === input.loanType);
    if (!loan) throw new Error("Choose a valid loan type.");
    function text(key, label, max = 200, required = true, source = input) {
        const value = source[key] == null ? "" : source[key];
        if (typeof value !== "string" || value.length > max || (required && !value.trim())) throw new Error("Please check " + label + ".");
        return value.trim();
    }
    function phone(key, label, required = false, source = input) {
        const value = text(key, label, 50, required, source);
        if (value && (!/^[0-9+\-]+$/.test(value) || !/[0-9]/.test(value))) throw new Error(label + " must contain digits, plus signs or dashes.");
        return value;
    }
    const fields = { loan_type: loan.name };
    const mapping = { clientName: "client_name", nationality: "nationality", birthPlace: "birth_place", primaryId: "primary_id", emergencyName: "emergency_name", motherName: "mother_name" };
    for (const [key, column] of Object.entries(mapping)) fields[column] = text(key, key);
    fields.client_name = fields.client_name.toUpperCase();
    fields.birth_date = text("birthDate", "birth date", 10);
    if (!validDate(fields.birth_date)) throw new Error("Enter a valid birth date.");
    fields.gender = text("gender", "gender", 50);
    fields.civil_status = text("civilStatus", "civil status", 50);
    fields.fund_source = text("fundSource", "source of fund", 50);
    if (!["Female", "Male", "Prefer to self-describe", "Prefer not to say"].includes(fields.gender) || !["Single", "Married", "Widowed", "Separated", "Other"].includes(fields.civil_status) || !["Employment", "Business", "Farming", "Remittance", "Pension", "Others"].includes(fields.fund_source)) throw new Error("Please check your selected options.");
    fields.home_phone = phone("homePhone", "Home phone");
    fields.mobile = phone("mobile", "Mobile number", true);
    fields.alternate_mobile = phone("alternateMobile", "Alternate mobile number");
    fields.emergency_phone = phone("emergencyPhone", "Emergency contact number", true);
    for (const value of [fields.mobile, fields.alternate_mobile, fields.emergency_phone]) {
        const normalized = value.replace(/-/g, "");
        const limit = normalized.startsWith("+63") ? 13 : 11;
        if (normalized.length > limit) throw new Error("Mobile and emergency contact numbers allow up to 11 characters, or 13 when starting with +63 (excluding dashes).");
    }
    fields.email = text("email", "email address", 200, false);
    if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) throw new Error("Enter a valid email address.");
    fields.secondary_id = text("secondaryId", "secondary ID", 200, false);
    fields.present_address = text("presentAddress", "present address", 500);
    fields.permanent_address = text("permanentAddress", "permanent address", 500);
    fields.fund_particulars = text("fundParticulars", "fund particulars", 300);
    const income = text("monthlyIncome", "monthly income", 16);
    if (!/^\d{1,13}(\.\d{1,2})?$/.test(income)) throw new Error("Enter a valid monthly income with up to two decimal places.");
    fields.monthly_income = income;
    if (!Array.isArray(input.beneficiaries) || input.beneficiaries.length > 10) throw new Error("Up to 10 beneficiaries are allowed.");
    const beneficiaries = [];
    for (const item of input.beneficiaries) {
        if (!item || typeof item !== "object" || Array.isArray(item)) throw new Error("Invalid beneficiary.");
        const beneficiary = {};
        for (const [key, column] of Object.entries({ Name: "name", Relationship: "relationship", Nationality: "nationality", Gender: "gender", Birthdate: "birth_date", Birthplace: "birth_place" })) beneficiary[column] = text(key, "beneficiary " + key, 200, false, item);
        beneficiary.contact_number = phone("Contact number", "Beneficiary contact", false, item);
        const contact = beneficiary.contact_number.replace(/-/g, "");
        if (contact.length > (contact.startsWith("+63") ? 13 : 11)) throw new Error("Beneficiary contact numbers allow up to 11 characters, or 13 when starting with +63 (excluding dashes).");
        if (!Object.values(beneficiary).some(Boolean)) continue;
        if (!beneficiary.name) throw new Error("Enter the beneficiary name.");
        if (beneficiary.birth_date && !validDate(beneficiary.birth_date)) throw new Error("Enter a valid beneficiary birth date.");
        beneficiary.birth_date = beneficiary.birth_date || null;
        beneficiaries.push(beneficiary);
    }
    let photo = null;
    if (input.photo) {
        if (typeof input.photo !== "string" || input.photo.length > 7 * 1024 * 1024) throw new Error("Photo must be under 5 MB.");
        const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/.exec(input.photo);
        if (!match) throw new Error("Choose a JPG, PNG or WebP photo.");
        const bytes = Buffer.from(match[2], "base64");
        const mime = match[1];
        const valid = mime === "image/jpeg" ? bytes.subarray(0, 3).equals(Buffer.from([255,216,255])) : mime === "image/png" ? bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) : bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
        if (!valid || bytes.length > 5 * 1024 * 1024) throw new Error("Choose a valid photo up to 5 MB.");
        photo = { mime, bytes };
    }
    return { loanId: loan.id, fields, beneficiaries, photo };
};
