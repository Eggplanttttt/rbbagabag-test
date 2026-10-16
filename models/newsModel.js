

const news = [
    {
        date: "04 April, 2025",
        title: "Restructured Organization",
        description: "Rural Bank of Bagabag proudly unveils its newly restructured organization \u2014 now delivering faster service, more flexible solutions, and a wider selection of financial products tailored to your needs.",
        link: "#",
        image: "assets/images/news-restructured-organization.jpg"
    },
    {
        date: "15 March, 2025",
        title: "PDIC Updated deposit insurance coverage",
        description: "Effective 15 March 2025, the maximum deposit insurance coverage (MDIC) provided by the PDIC will be increased from P500,000 to P1 million per depositor, per bank.",
        link: "https://www.pdic.gov.ph/MDIC",
        image: "assets/images/news-pdic-coverage.jpg"
    },
    {
        date: "04 April, 2025",
        title: "Towards Digitalization",
        description: "Rural Bank of Bagabag is accelerating its digital transformation \u2014 streamlining processes to provide smarter, faster, and more accessible banking experiences for every customer.",
        link: "#",
        image: "assets/images/news-digitalization.jpg"
    }
];

const News = {
    all() { return news; },

    latest(count) { return news.slice(0, count); }
};

module.exports = News;
