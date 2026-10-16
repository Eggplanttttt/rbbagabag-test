

const bankInfo = {
    name: "Rural Bank of Bagabag (N.V.), Inc.",
    shortName: "Rural Bank of Bagabag",
    tagline: "Your Progress, Is our Success!",
    since: "Since 1968",
    copyrightYear: "2025",


    logo: "assets/images/bank-logo.svg",
    logoAlt: "Rural Bank of Bagabag logo",

    phone: "078 332 2013",
    mobile: "0956 019 3299",
    emails: ["rbbagabag@rbap.org", "rbbagabagofficial@gmail.com"],


    addressLines: ["65A National Highway", "San Pedro, Bagabag", "Nueva Vizcaya 3711"],


    formRecipientEmail: "rbbagabag@rbap.org"
};


const heroContent = {
    message: "At the heart of every thriving community is a trusted partner \u2014 and that's what Rural Bank of Bagabag has been for generations. Built on a foundation of integrity, reliability, and hometown pride, we are committed to supporting the dreams and needs of every individual, family, and local business we serve. From helping farmers grow their livelihood to empowering young entrepreneurs, we believe in banking that uplifts. As your local bank, we don't just handle finances; we build futures. Join us, and let's grow together \u2014 the Bagabag way.",
    buttonText: "Send an Inquiry",
    buttonLink: "/contact",
    callLabel: "For inquiry? Call:"
};


const financialNeeds = {
    title: "FOR YOUR FINANCIAL NEEDS!!",
    message: "When you need financial security and flexibility, we've got the perfect option for you! Choose the loan that fits your needs and take the next step toward your financial goals today!"
};


const protectYourMoney = {
    title: "PROTECT YOUR MONEY (PYM)",
    subtitle: "Inclusive Finance - Financial Education",
    heading: "Start Protecting Your Money!",
    message: "Rural Bank of Bagabag (N.V.), Inc. supports the BSP's Protect Your Money campaign. We promote safer digital finance through strong security features, continuous customer education, and programs that help countryside Filipinos recognize risks and protect their hard-earned money.",
    buttonText: "Open the BSP Protect Your Money resource",
    buttonLink: "https://www.bsp.gov.ph/Inclusive%20Finance/EFLP/PYM-ATM.gif",
    image: "assets/images/protect-your-money-banner.jpg",
    imageAlt: "Protect Your Money campaign banner"
};


const latestOffer = {
  "title": "LATEST OFFER",
  "subtitle": "FOR POPULAR LOANS",
  "loanName": "Back to Back Loan",
  "description": "Secure quick liquidity for your financial needs while keeping your savings intact, using your existing deposits or investments as collateral.",
  "maximumAmount": "Up to 90% of Deposit Value",
  "interestRate": "Low rates starting at 2.5%",
  "buttonText": "Apply for this loan",
  "buttonLink": "/contact?subject=Back%20to%20Back%20Loan%20Application",
  "image": "assets/images/back2back-loan.jpg",
  "imageAlt": "Savings deposit certificate and financial growth representing Back to Back Loan"
};


const affiliatesSection = {
    title: "AFFILIATE",
    message: "Committed to trusted banking through strong affiliations with the Bangko Sentral ng Pilipinas (BSP) and membership in the Rural Bankers Association of the Philippines (RBAP). As a reporting entity to the Credit Information Corporation (CIC) and a BSP-regulated, PDIC-insured bank, we uphold established standards of responsible and secure banking. We also partner with PeraHub to provide accessible and convenient financial services to our customers.",
    subMessage: "Only in Rural Bank of Bagabag (N.V.), Inc.",
    affiliatesTitle: "Our affiliates Partners",
    affiliates: [
        { name: "RBAP", logo: "assets/images/affiliates/RBAP.png", description: "The RBAP was founded in 1955 but initially remained a non-incorporated association of institutions." },
        { name: "BSP", logo: "assets/images/affiliates/BSP.png", description: "The Bangko Sentral ng Pilipinas is the government-owned central bank of the Philippines. It was established on January 3, 1949." },
        { name: "PDIC", logo: "assets/images/affiliates/PDIC.png", description: "“Deposits are insured by PDIC up to P1 Million per depositor”" },
        { name: "CIC", logo: "assets/images/affiliates/CIC.jpg", description: "The Credit Information Corporation (CIC) is a government owned and controlled corporation providing credit information in the Philippines." },
        { name: "PeraHub", logo: "assets/images/affiliates/PERAHUB.webp", description: "PERA HUB (operated by PETNET Inc.) is a leading consumer financial services center and the largest retail agent of Western Union in the Philippines, ." },
    ]
};


const navigationLinks = [
    { label: "Home", link: "/" },
    { label: "About Us", link: "/about" },
    { label: "ROPA", link: "/ropa" },
    { label: "Loans", link: "/loans", dropdownFromLoans: true },
    { label: "Deposits", link: "/deposits" },
    { label: "Contact Us", link: "/contact" },
    { label: "Annual Report", link: "/annual-report" }
];


const footerQuickLinks = [
    { label: "About Us", link: "/about" },
    { label: "Services", link: "/loans" },
    { label: "ROPA", link: "/ropa" },
    { label: "Savings Deposit", link: "/deposits" },
    { label: "Contact", link: "/contact" }
];


module.exports = {
    bankInfo,
    heroContent,
    financialNeeds,
    protectYourMoney,
    latestOffer,
    affiliatesSection,
    navigationLinks,
    footerQuickLinks
};
