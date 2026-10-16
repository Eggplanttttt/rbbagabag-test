

const app = require("./app");
const config = require("./config");
//hello
app.listen(config.port, "0.0.0.0", function () {
    console.log("Rural Bank of Bagabag website running on port " + config.port);
});
