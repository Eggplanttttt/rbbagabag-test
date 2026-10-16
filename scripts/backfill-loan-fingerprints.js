const fingerprint = require("../models/loanApplicationFingerprint");

module.exports = async function backfill(connection) {
    await connection.beginTransaction();
    try {
    await connection.query("DELETE FROM application_fingerprints");
    const [applications] = await connection.query({ sql: "SELECT * FROM loan_applications ORDER BY id", dateStrings: true });
    for (const application of applications) {
        const { id, status, created_at, updated_at, ...fields } = application;
        const [rows] = await connection.query({ sql: "SELECT name, relationship, nationality, gender, birth_date, birth_place, contact_number FROM application_beneficiaries WHERE application_id = ?", values: [id], dateStrings: true });
        const [photos] = await connection.execute("SELECT image_data FROM application_photos WHERE application_id = ?", [id]);
        const hash = fingerprint(fields, rows, photos.length ? { bytes: photos[0].image_data } : null);
        // Preserve any existing records, including duplicates submitted before this rule.
        await connection.execute("INSERT INTO application_fingerprints (fingerprint, application_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE fingerprint = fingerprint", [hash, id]);
    }
    await connection.commit();
    } catch (error) { await connection.rollback(); throw error; }
};
