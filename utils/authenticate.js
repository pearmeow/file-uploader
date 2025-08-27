const bcrypt = require("bcryptjs");

async function validPassword(givenPass, hashPass) {
    return await bcrypt.compare(givenPass, hashPass);
}

async function makePassword(pass) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(pass, salt);
    return hash;
}

module.exports = {
    validPassword,
    makePassword,
};
