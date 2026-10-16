

const Loan = require("../models/loanModel");
const Deposit = require("../models/depositModel");
const Ropa = require("../models/ropaModel");
const Report = require("../models/reportModel");

exports.about = function (req, res) {
    res.render("about", {
        title: "Rural Bank of Bagabag | About Us",
        description: "About Rural Bank of Bagabag (N.V.), Inc., your local bank in Bagabag, Nueva Vizcaya, serving the community since 1968.",
        pageCss: ["about"]
    });
};

exports.loans = function (req, res) {
    res.render("loans", {
        title: "Rural Bank of Bagabag | Loans",
        description: "Loans from Rural Bank of Bagabag: agricultural, consumption, housing, salary, SME, auto, motorcycle, and back-to-back loans.",
        pageCss: ["loans"],
        pageJs: ["loan-application"],
        loans: Loan.all()
    });
};

exports.deposits = function (req, res) {
    res.render("deposits", {
        title: "Rural Bank of Bagabag | Deposits",
        description: "Savings and time deposit products from Rural Bank of Bagabag, PDIC-insured.",
        pageCss: ["deposits"],
        deposits: Deposit.all(),
        notice: Deposit.notice()
    });
};

exports.ropa = function (req, res) {
    res.render("ropa", {
        title: "Rural Bank of Bagabag | ROPA",
        description: "Real and Other Properties Acquired (ROPA) by Rural Bank of Bagabag that are available for sale.",
        pageCss: ["ropa"],
        properties: Ropa.all()
    });
};

exports.annualReport = function (req, res) {
    res.render("annual-report", {
        title: "Rural Bank of Bagabag | Annual Report",
        description: "View or download the yearly annual reports of Rural Bank of Bagabag (N.V.), Inc.",
        pageCss: ["annual-report"],
        reports: Report.all()
    });
};
