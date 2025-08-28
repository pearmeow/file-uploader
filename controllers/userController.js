const db = require("../db/queries");
const passport = require("passport");
const { hashPassword } = require("../utils/authenticate");
const { validationResult, matchedData } = require("express-validator");
const {
    validatePassword,
    validateConfirm,
    validateUsername,
} = require("../middlewares/validators");

const getLogin = (req, res) => {
    res.render("index", { title: "Log in" });
};

const getRegister = (req, res) => {
    res.render("register", { title: "Register" });
};

const postRegister = [
    [validateUsername, validatePassword, validateConfirm],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render("register", {
                title: "Register",
                errors: errors.array(),
            });
        }
        const data = matchedData(req);
        const username = data.username;
        const hashedPass = hashPassword(data.password);
        db.createUser(username, hashedPass);
        res.redirect("/");
    },
];

const postLogin = passport.authenticate("local", {
    failureMessage: "Username or password wrong",
    failureRedirect: "/",
    successRedirect: "/",
});

const getLogout = (req, res) => {
    req.logout((err) => {
        if (err) {
            throw new Error(err);
        }
    });
    res.redirect("/");
};

module.exports = {
    getLogin,
    getRegister,
    postRegister,
    postLogin,
    getLogout,
};
