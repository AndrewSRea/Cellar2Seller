require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var bodyParser = require("body-parser");

var db = require("./models");

var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(cookieParser());
app.use(
    session({
        key: "user_sid",
        secret: "uiorwunqp39214un",
        resave: false,
        saveUninitialized: false,
        cookie: {
        expires: 800000
        }
    })
);
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());
app.use(express.static("public"));

// Handlebars
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

module.exports = {
    sessionChecker: function(req, res, next) {
        if (req.session.user && req.cookies.user_sid) {
        res.redirect("/profile");
        }
        next();
    }
};

// Routes
require("./routes/apiRoutes")(app);

// Routes
require("./config/seeds")(app);

require("./routes/htmlRoutes")(app);

var syncOptions = {
    force: false
};

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
    syncOptions.force = true;
}
console.log(process.env.NODE_ENV);

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
    app.listen(PORT, function() {
        console.log(
            "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
            PORT,
            PORT
        );
    });
});

module.exports = app;