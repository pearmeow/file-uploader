const setUser = (req, res, next) => {
    res.locals.messages = req.session.messages;
    req.session.messages = "";
    res.locals.currentUser = req.user;
    next();
};

module.exports = {
    setUser,
};
