

const site = require("../models/siteModel");
const Loan = require("../models/loanModel");
const News = require("../models/newsModel");
const Testimonial = require("../models/testimonialModel");

exports.index = function (req, res) {
    const selectedType = Loan.normalizeType(req.query.type);

    res.render("home", {
        title: "Rural Bank of Bagabag | Home",
        description: "Rural Bank of Bagabag (N.V.), Inc. - your trusted local bank in Bagabag, Nueva Vizcaya since 1968. Loans, deposits, remittance, and more.",
        pageCss: ["home"],
        pageJs: ["carousel"],

        hero: site.heroContent,
        financialNeeds: site.financialNeeds,
        protectYourMoney: site.protectYourMoney,
        latestOffer: site.latestOffer,
        affiliatesSection: site.affiliatesSection,

        loanTypes: Loan.types,
        selectedType: selectedType,
        loans: Loan.byType(selectedType),

        testimonials: Testimonial.all(),
        news: News.all()
    });
};
