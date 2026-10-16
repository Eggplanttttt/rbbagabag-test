// Integration check: uses synthetic records and removes only its own test rows.
const assert = require("node:assert/strict");
const app = require("../app");
const Loan = require("../models/loanModel");
const database = require("../config/database");
const validate = require("../validators/loanApplication");

async function run() {
    const server = app.listen(0, "127.0.0.1");
    await new Promise(resolve => server.once("listening", resolve));
    const base = "http://127.0.0.1:" + server.address().port;
    const saved = [];
    try {
        const form = {
            clientName: "TEST ONLY, " + require("node:crypto").randomUUID().toUpperCase(), nationality: "Filipino", birthDate: "1990-01-01",
            birthPlace: "Test", gender: "Male", civilStatus: "Single", homePhone: "",
            mobile: "+63-900-000-0000", alternateMobile: "", email: "sample@example.test",
            primaryId: "TEST-ID", secondaryId: "", emergencyName: "Test contact", emergencyPhone: "09000000000",
            presentAddress: "Synthetic test", permanentAddress: "Synthetic test", fundSource: "Employment",
            fundParticulars: "Test", monthlyIncome: "10000.50", motherName: "Test record",
            beneficiaries: [{ Name: "Test beneficiary", Relationship: "Sibling", Nationality: "Filipino", Gender: "Female", Birthdate: "2000-01-01", Birthplace: "Test", "Contact number": "+63-900-000-0000" }],
            photo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII="
        };
        const post = body => fetch(base + "/loan-applications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        assert.throws(() => validate({ ...form, loanType: "Agricultural Loan", mobile: "letters" }));
        assert.throws(() => validate({ ...form, loanType: "Agricultural Loan", birthDate: "2020-02-31" }));
        assert.throws(() => validate({ ...form, loanType: "Agricultural Loan", photo: "data:image/png;base64,YWJj" }));
        assert.equal((await post({ ...form, loanType: "Unknown" })).status, 422);
        for (const loan of Loan.all()) {
            const responses = await Promise.all([post({ ...form, loanType: loan.name }), post({ ...form, loanType: loan.name })]);
            assert.deepEqual(responses.map(response => response.status).sort(), [201, 409]);
            const response = responses.find(response => response.status === 201);
            const result = await response.json();
            assert.equal(response.status, 201, JSON.stringify(result));
            assert.equal(result.saved, true);
            assert.equal(Object.hasOwn(result, "reference"), false);
            saved.push([loan.id, form.clientName]);
            const duplicate = await post({ ...form, loanType: loan.name });
            assert.equal(duplicate.status, 409);
            assert.match((await duplicate.json()).error, /already been submitted/);
            const formattedDuplicate = await post({ ...form, loanType: loan.name, presentAddress: "Synthetic,\n  test", permanentAddress: "Synthetic\n test" });
            assert.equal(formattedDuplicate.status, 409, "Address formatting must not bypass duplicate checks");
            const pool = database.forLoan(loan.id);
            const [rows] = await pool.execute("SELECT * FROM loan_applications WHERE client_name = ?", [form.clientName]);
            assert.equal(rows.length, 1);
            assert.equal(Object.hasOwn(rows[0], "reference"), false);
            assert.equal(rows[0].loan_type, loan.name);
            assert.equal(rows[0].status, "pending");
            assert.equal(rows[0].mobile, form.mobile);
            assert.equal(rows[0].monthly_income, "10000.50");
            const [beneficiaries] = await pool.execute("SELECT * FROM application_beneficiaries WHERE application_id = ?", [rows[0].id]);
            assert.equal(beneficiaries.length, 1);
            const [photos] = await pool.execute("SELECT mime_type, LENGTH(image_data) AS size FROM application_photos WHERE application_id = ?", [rows[0].id]);
            assert.equal(photos[0].mime_type, "image/png");
            assert.ok(photos[0].size > 0);
            console.log("Verified: " + database.databases[loan.id]);
        }
        const page = await fetch(base + "/loans");
        assert.equal(page.status, 200);
        assert.ok((await page.text()).includes("Submit application"));
        console.log("Validation, all eight submission destinations, related rows and page rendering passed.");
    } finally {
        try {
            for (const [id, clientName] of saved) await database.forLoan(id).execute("DELETE FROM loan_applications WHERE client_name = ?", [clientName]);
        } finally {
            await database.close();
            await new Promise(resolve => server.close(resolve));
        }
    }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
