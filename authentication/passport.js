const passport = require("passport");
const db = require("../db/queries");
const LocalStrategy = require("passport-local").Strategy;
const authenticate = require("../utils/authenticate");

function serializer(user, done) {
    done(null, user.id);
}

async function deserializer(id, done) {
    try {
        const user = await db.getUserById(Number(id));
        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    } catch (err) {
        done(err);
    }
}

async function verify(username, password, done) {
    try {
        const user = await db.getUserByUsername(username);
        if (!user) {
            return done(null, false, { message: "Bad username" });
        }
        if (!(await authenticate.validPassword(password, user.password))) {
            return done(null, false, { message: "Bad password" });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}

passport.use(new LocalStrategy(verify));
passport.deserializeUser(deserializer);
passport.serializeUser(serializer);
