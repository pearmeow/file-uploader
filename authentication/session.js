const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const PrismaClient = require("../db/client");
require("dotenv").config();

const session = expressSession({
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // ms
    },
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(PrismaClient, {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
    }),
});

module.exports = session;
