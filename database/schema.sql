CREATE TABLE IF NOT EXISTS loan_applications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    loan_type VARCHAR(100) NOT NULL,
    client_name VARCHAR(200) NOT NULL,
    nationality VARCHAR(200) NOT NULL,
    birth_date DATE NOT NULL,
    birth_place VARCHAR(200) NOT NULL,
    gender VARCHAR(50) NOT NULL,
    civil_status VARCHAR(50) NOT NULL,
    home_phone VARCHAR(50) NOT NULL DEFAULT '',
    mobile VARCHAR(50) NOT NULL,
    alternate_mobile VARCHAR(50) NOT NULL DEFAULT '',
    email VARCHAR(200) NOT NULL DEFAULT '',
    primary_id VARCHAR(200) NOT NULL,
    secondary_id VARCHAR(200) NOT NULL DEFAULT '',
    emergency_name VARCHAR(200) NOT NULL,
    emergency_phone VARCHAR(50) NOT NULL,
    present_address VARCHAR(500) NOT NULL,
    permanent_address VARCHAR(500) NOT NULL,
    fund_source VARCHAR(50) NOT NULL,
    fund_particulars VARCHAR(300) NOT NULL,
    monthly_income DECIMAL(15,2) NOT NULL,
    mother_name VARCHAR(200) NOT NULL,
    status ENUM('pending','under_review','approved','declined') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status_created (status, created_at),
    INDEX idx_client_name (client_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS application_beneficiaries (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(200) NOT NULL,
    relationship VARCHAR(200) NOT NULL DEFAULT '',
    nationality VARCHAR(200) NOT NULL DEFAULT '',
    gender VARCHAR(200) NOT NULL DEFAULT '',
    birth_date DATE NULL,
    birth_place VARCHAR(200) NOT NULL DEFAULT '',
    contact_number VARCHAR(50) NOT NULL DEFAULT '',
    FOREIGN KEY (application_id) REFERENCES loan_applications(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS application_photos (
    application_id BIGINT UNSIGNED PRIMARY KEY,
    mime_type VARCHAR(30) NOT NULL,
    image_data MEDIUMBLOB NOT NULL,
    FOREIGN KEY (application_id) REFERENCES loan_applications(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS application_fingerprints (
    fingerprint CHAR(64) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
    application_id BIGINT UNSIGNED NOT NULL UNIQUE,
    FOREIGN KEY (application_id) REFERENCES loan_applications(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
