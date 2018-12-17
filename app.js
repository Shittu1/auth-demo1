const express = require("express");
const app = express();
const passport = require("passport");
const localSrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const session = require("express-session");
const mongoose = require("mongoose");
const User = require("./models/user");

mongoose.connect("mongodb://shittu:edo1984@ds135810.mlab.com:35810/auth-demo", { useNewUrlParser: true });

app.use(session({
    secret: 'Shadams',
    resave: false,
    saveUninitialized: false
    // cookie: { secure: true }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

//Setup passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//===================
//All Routes
//===================

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/secret", (req, res) => {
    res.render("secret");
});

// Show the signup form
app.get("/register", (req, res) => {
    res.render("register");  
});

//Post form input values
app.post("/register", (req, res) => {
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            res.render("register");
        } 
        passport.authenticate("local")(req, res, () => {
            res.redirect("/secret");
        });
    });
});

app.listen(3000, () => {
    console.log("Server started..");
});