const db = require("");

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

// handled in passport, not here
const postLogin = async (req, res) => {
    res.redirect("/");
};

module.exports = {
    getLogin,
    getRegister,
    postRegister,
};
