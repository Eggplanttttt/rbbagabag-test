const { createHash } = require("node:crypto");

function ordered(record) {
    return Object.fromEntries(Object.keys(record).sort().map(key => [key, typeof record[key] === "string" ? record[key].trim() : record[key]]));
}
module.exports = function fingerprint(fields, beneficiaries, photo) {
    const normalized = { ...fields, monthly_income: Number(fields.monthly_income).toFixed(2) };
    for (const key of ["present_address", "permanent_address"]) {
        normalized[key] = normalized[key].replace(/[\s,]+/g, " ").trim();
    }
    const people = beneficiaries.map(item => JSON.stringify(ordered(item))).sort();
    const image = photo ? createHash("sha256").update(photo.bytes).digest("hex") : "";
    return createHash("sha256").update(JSON.stringify([ordered(normalized), people, image])).digest("hex");
};
