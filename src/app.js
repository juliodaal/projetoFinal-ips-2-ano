const express = require("express");
const exphbs = require("express-handlebars");
const options = require("./database/options").parameters.options;
const path = require("path");
const session = require("express-session");
const passport = require("passport");
// Initialization
const app = express();
require("./config/passport");

// Settings
app.set('port', process.env.PORT || options.port);
app.set('views', path.join(__dirname,"views"));
app.engine('.hbs', exphbs({
    defaultLayout: "default",
    layoutsDir: path.join(app.get('views'), "layouts"),
    partialsDir: path.join(app.get('views'), "partials"),
    extname: ".hbs"
}));
app.set("view engine", ".hbs");

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}));

//Config parameters
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(passport.initialize());
app.use(passport.session());

// Global Varibles
app.use((req,res,next) => {
    res.locals.user = req.user || null;
    next();
});

// Static Files
app.use(express.static(path.join(__dirname,"public")));

// Routes New
app.use(require('./routes/index.routes'));
app.use(require('./routes/dashboard.routes'));
app.use(require('./routes/users.routes'));


module.exports.app = app;