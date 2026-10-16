
const annualReports = [
    { year: "2022", title: "2022 Annual Report", file: "assets/documents/annual-report-2022.pdf" },
    { year: "2023", title: "2023 Annual Report", file: "assets/documents/annual-report-2023.pdf" },
    { year: "2024", title: "2024 Annual Report", file: "assets/documents/annual-report-2024.pdf" },
    { year: "2025", title: "2025 Annual Report", file: "assets/documents/annual-report-2025.pdf" }
];

const Report = {
    all() { return annualReports; }
};

module.exports = Report;
