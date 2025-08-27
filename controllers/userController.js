const db = require("../db/queries");
const passport = require("passport");

const getLogin = (req, res) => {
    res.render("index", { title: "Log in" });
};

const getRegister = (req, res) => {
    res.render("register", { title: "Register" });
};

const postRegister = async (req, res) => {
    // send query to db
    res.redirect("/");
};

const postLogin = passport.authenticate("local", {
    failureMessage: "Username or password wrong",
    successRedirect: "/folder",
});

module.exports = {
    getLogin,
    getRegister,
    postRegister,
    postLogin,
};
