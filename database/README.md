# Loan application databases

Identical submissions for the same loan type return HTTP 409 and keep the application form open. `application_fingerprints` stores a unique SHA-256 hash of validated customer fields, beneficiaries and optional photo; the unique key prevents concurrent duplicate submissions. The entire duplicate transaction is rolled back. Setup backfills fingerprints for existing applications without deleting historical duplicates. Changes to application status do not affect duplicate matching.

Start MySQL in XAMPP. Run `npm.cmd run db:setup` from the project directory. Setup creates missing databases/tables without deleting records. Connection settings are in `config/database.js`; override them with DB_HOST, DB_PORT, DB_USER and DB_PASSWORD in a local `.env` file (see `.env.example`). Default settings match local XAMPP: 127.0.0.1:3306, root, blank password.

| Loan | Database |
| --- | --- |
| Agricultural | rbb_agricultural_loans |
| Consumption | rbb_consumption_loans |
| Housing | rbb_housing_loans |
| Salary | rbb_salary_loans |
| SME | rbb_sme_loans |
| Auto | rbb_auto_loans |
| Motorcycle | rbb_motorcycle_loans |
| Back To Back | rbb_back_to_back_loans |

In phpMyAdmin, open the corresponding database and browse `loan_applications`. Each row has an internal ID, timestamps, customer details and status (pending, under_review, approved, declined). No reference number is generated or stored. Setup removes the former reference column from existing databases while preserving applications. Beneficiaries are in `application_beneficiaries`, linked by application_id. Optional photo bytes are in `application_photos`, also linked by application_id. Deleting an application deletes its linked beneficiaries and photo.

`database/schema.sql` defines the shared structure. `scripts/setup-loan-databases.js` applies it to all eight databases. Existing columns are not altered automatically; use migrations for future changes.

Submission route: POST /loan-applications. `validators/loanApplication.js` validates and normalizes data, `controllers/loanApplicationController.js` handles responses, and `models/loanApplicationModel.js` saves all related rows in one transaction. Database selection uses an internal allowlist, never a user-supplied database name. No public endpoint lists customer applications; management currently uses phpMyAdmin.

The Node server must be able to reach this MySQL instance. A remote deployment needs a reachable persistent MySQL host and credentials; localhost on a hosted server does not point to your XAMPP computer. Use a dedicated database user with access only to these databases for deployment, rather than the local XAMPP root account.
