const passport = require("passport");
const db = require("../db/queries");
const LocalStrategy = require("passport-local").Strategy;
const authenticate = require("../utils/authenticate");
const session = require("./sessionConfig");

function serializer(user, done) {
    done(null, user.id);
}

async function deserializer(id, done) {
    try {
        // use db to get user from id
        done(null, user);
    } catch (err) {
        done(err);
    }
}

async function verify(username, password, done) {
    try {
        // use db to get the user from username
        if (!user) {
            return done(null, false, { message: "Bad username" });
        }
        if (!authenticate.validPassword(password, user.password)) {
            return done(null, false, { message: "Bad password" });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}

passport.deserializeUser(serializer);
passport.serializeUser(deserializer);
passport.use(new LocalStrategy(verify));
