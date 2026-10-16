

const deposits = [
    {
        name: "Savings Deposit",
        image: "assets/images/savings-deposit.jpg",
        description: "A safe place to keep your money while it grows, with easy deposits and withdrawals.",
        features: ["Open an account with a valid ID", "Deposit and withdraw at the branch", "Ask our staff about the minimum balance and interest"]
    },
    {
        name: "Time Deposit",
        image: "assets/images/time-deposit.jpg",
        description: "Place a fixed amount for a fixed period and earn interest.",
        features: ["Choose a placement period", "Interest is higher than regular savings", "Ask our staff about the current rates"]
    }
];

const depositNotice = "“Deposits are insured by PDIC up to P1 Million per depositor”";
const depositNoticeLink = "https://www.pdic.gov.ph/MDIC";

const Deposit = {
    all() { return deposits; },
    notice() { return { text: depositNotice, link: depositNoticeLink }; }
};

module.exports = Deposit;
