const database = require("../config/database");
const fingerprint = require("./loanApplicationFingerprint");

exports.create = async function (data) {
    const connection = await database.forLoan(data.loanId).getConnection();
    try {
        await connection.beginTransaction();
        const [result] = await connection.query("INSERT INTO loan_applications SET ?", data.fields);
        try {
            await connection.execute("INSERT INTO application_fingerprints (fingerprint, application_id) VALUES (?, ?)", [fingerprint(data.fields, data.beneficiaries, data.photo), result.insertId]);
        } catch (error) {
            if (error.code === "ER_DUP_ENTRY") error.code = "APPLICATION_ALREADY_SUBMITTED";
            throw error;
        }
        for (const beneficiary of data.beneficiaries) {
            await connection.query("INSERT INTO application_beneficiaries SET ?", { application_id: result.insertId, ...beneficiary });
        }
        if (data.photo) await connection.execute("INSERT INTO application_photos (application_id, mime_type, image_data) VALUES (?, ?, ?)", [result.insertId, data.photo.mime, data.photo.bytes]);
        await connection.commit();
        return result.insertId;
    } catch (error) { await connection.rollback(); throw error; }
    finally { connection.release(); }
};
