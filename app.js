const express = require("express");
const path = require("node:path");
const indexRouter = require("./routes/indexRouter");
const folderRouter = require("./routes/folderRouter");
const passport = require("passport");
const session = require("./authentication/session");
const locals = require("./middlewares/locals");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const assetsPath = path.join(__dirname, "public");
app.use(express.urlencoded({ extended: true })); // make post work and have a body
app.use(express.static(assetsPath));

app.use(session);
app.use(passport.session());
require("./authentication/passport");

// add user to locals so it's accessible in views
app.use(locals.setUser);

app.use("/folder", folderRouter);
app.use("/", indexRouter);
app.get("/{*splat}", (req, res) => res.render("404"));
app.use((err, req, res, next) => res.status(500).render("500"));

const PORT = 3000;

app.listen(PORT, (error) => {
    if (error) {
        throw error;
    }
    console.log(`Express app listening on http://127.0.0.1:${PORT}`);
});
