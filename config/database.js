require("./index");
const mysql = require("mysql2/promise");

// Database names come from this allowlist, never from submitted form data.
const databases = Object.freeze({
    "agricultural-loan": "rbb_agricultural_loans",
    "consumption-loan": "rbb_consumption_loans",
    "housing-loan": "rbb_housing_loans",
    "salary-loan": "rbb_salary_loans",
    "sme-loan": "rbb_sme_loans",
    "auto-loan": "rbb_auto_loans",
    "motorcycle-loan": "rbb_motorcycle_loans",
    "back-to-back-loan": "rbb_back_to_back_loans"
});
const options = {
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    charset: "utf8mb4",
    connectionLimit: 5,
    timezone: "Z"
};
const pools = new Map();
function forLoan(id) {
    if (!Object.hasOwn(databases, id)) throw new Error("Unknown loan type");
    if (!pools.has(id)) pools.set(id, mysql.createPool({ ...options, database: databases[id] }));
    return pools.get(id);
}
async function close() { await Promise.all([...pools.values()].map(pool => pool.end())); pools.clear(); }
module.exports = { databases, options, forLoan, close };
