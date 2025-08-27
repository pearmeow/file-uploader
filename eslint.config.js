const globals = require("globals");

module.exports = [
    {
        languageOptions: {
            sourceType: "commonjs",
            globals: {
                ...globals.node,
            },
        },
    },
];
