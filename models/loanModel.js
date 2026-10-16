

const loans = [
    {
        id: "agricultural-loan",              
        name: "Agricultural Loan",
        type: "Secured",                      
        image: "assets/images/ai/Agricultural loan.png",
        description: "Financing for farmers, such as agricultural machineries and farm inputs.",
        purpose: "To buy farm inputs (seeds, fertilizer), equipment, and to support farming operations.",
        requirements: ["Completed loan application form", "Valid government-issued ID", "Proof of farm ownership or tenancy", "Collateral documents"]
    },
    {
        id: "consumption-loan",
        name: "Consumption Loan",
        type: "Unsecured",
        image: "assets/images/ai/Consumption loan.png",
        description: "For personal and household needs.",
        purpose: "To pay for everyday needs such as education, medical expenses, or home repairs.",
        requirements: ["Completed loan application form", "Valid government-issued ID", "Proof of income", "Proof of billing / residence"]
    },
    {
        id: "housing-loan",
        name: "Housing Loan",
        type: "Secured",
        image: "assets/images/ai/Housing.png",
        description: "Financing to buy, build, or improve a home.",
        purpose: "To purchase a house or lot, construct a home, or renovate an existing one.",
        requirements: ["Completed loan application form", "Valid government-issued ID", "Proof of income", "Property title and tax documents"]
    },
    {
        id: "salary-loan",
        name: "Salary Loan",
        type: "Unsecured",
        image: "assets/images/ai/salary.png",
        description: "A quick loan for employees with a regular salary.",
        purpose: "To cover urgent or planned expenses, paid back through your salary.",
        requirements: ["Completed loan application form", "Valid government-issued ID", "Certificate of employment", "Latest payslips"]
    },
    {
        id: "sme-loan",
        name: "SME Loan",
        type: "Secured",
        image: "assets/images/ai/SME.png",
        description: "Working capital and expansion financing for small and medium businesses.",
        purpose: "To buy inventory, equipment, or expand a local business.",
        requirements: ["Completed loan application form", "Valid government-issued ID", "Business permit / registration", "Financial records and collateral documents"]
    },
    {
        id: "auto-loan",
        name: "Auto Loan",
        type: "Secured",
        image: "assets/images/auto loan.png",
        description: "Financing to buy a car, van, or truck.",
        purpose: "To purchase a new or second-hand vehicle.",
        requirements: ["Completed loan application form", "Valid government-issued ID", "Proof of income", "Vehicle quotation or sales invoice"]
    },
    {
        id: "motorcycle-loan",
        name: "Motorcycle Loan",
        type: "Secured",
        image: "assets/images/motorcycle loan.png",
        description: "Financing to buy a motorcycle or tricycle.",
        purpose: "To purchase a motorcycle for work, business, or daily travel.",
        requirements: ["Completed loan application form", "Valid government-issued ID", "Proof of income", "Motorcycle quotation"]
    },
    {
        id: "back-to-back-loan",
        name: "Back To Back Loan",
        type: "Secured",
        image: "assets/images/ai/b2b.png",
        description: "A loan secured by your own deposit with the bank.",
        purpose: "To borrow money while keeping your deposit earning.",
        requirements: ["Completed loan application form", "Valid government-issued ID", "Deposit account or time deposit certificate"]
    }
];

const Loan = {
    types: ["All", "Secured", "Unsecured"],

 
    all() {
        return loans;
    },


    byType(type) {
        const match = Loan.types.find(function (t) { return t.toLowerCase() === String(type || "").toLowerCase(); });
        if (!match || match === "All") { return loans; }
        return loans.filter(function (loan) { return loan.type === match; });
    },


    normalizeType(type) {
        const match = Loan.types.find(function (t) { return t.toLowerCase() === String(type || "").toLowerCase(); });
        return match || "All";
    }
};

module.exports = Loan;
