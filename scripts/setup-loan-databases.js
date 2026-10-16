const fs = require("node:fs");
const path = require("node:path");
const mysql = require("mysql2/promise");
const { options, databases } = require("../config/database");

async function setup() {
    const connection = await mysql.createConnection(options);
    try {
        const statements = fs.readFileSync(path.join(__dirname, "..", "database", "schema.sql"), "utf8").split(";").map(sql => sql.trim()).filter(Boolean);
        for (const database of Object.values(databases)) {
            await connection.query("CREATE DATABASE IF NOT EXISTS `" + database + "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            await connection.query("USE `" + database + "`");
            for (const statement of statements) await connection.query(statement);
            const [referenceColumns] = await connection.query("SHOW COLUMNS FROM loan_applications LIKE 'reference'");
            if (referenceColumns.length) await connection.query("ALTER TABLE loan_applications DROP COLUMN reference");
            await require("./backfill-loan-fingerprints")(connection);
            console.log("Ready: " + database);
        }
    } finally { await connection.end(); }
}
setup().catch(error => { console.error("Database setup failed:", error.code || error.message); process.exitCode = 1; });
