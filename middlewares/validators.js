const { body, param } = require("express-validator");

const spaceTest = (value) => {
    if (/\ /.test(value)) {
        throw new Error();
    }
    return value;
};

const validateUsername = body("username")
    .custom(spaceTest)
    .withMessage("Username cannot contain spaces")
    .isLength({ min: 3, max: 32 })
    .withMessage("Username must be between 3 and 32 characters");

const validatePassword = body("password")
    .custom(spaceTest)
    .withMessage("Password cannot contain spaces")
    .isLength({ min: 8, max: 32 })
    .withMessage("Password must be between 8 and 32 characters");

const validateConfirm = body("confirm")
    .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error();
        }
        return value;
    })
    .withMessage("Passwords must match and not be empty");

const validateIdFactory = (idName) => {
    return body(idName)
        .isInt({ min: 0, max: Number.MAX_SAFE_INTEGER })
        .withMessage("Id must be nonnegative");
};

const validateQueryId = (fieldName) => {
    return param(fieldName)
        .optional()
        .isInt({ min: 0, max: Number.MAX_SAFE_INTEGER })
        .withMessage("Id must be nonnegative");
};

const validateNameFactory = (fieldName) => {
    return body(fieldName)
        .isLength({ min: 1, max: 32 })
        .withMessage("Folder name must be between 0 and 32 characters");
};

module.exports = {
    validateUsername,
    validatePassword,
    validateConfirm,
    validateIdFactory,
    validateQueryId,
    validateNameFactory,
};
