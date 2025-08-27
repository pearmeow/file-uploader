const { Pool } = require("pg");
require("dotenv").config();

module.exports = new Pool({
    // connectionString: process.env.DB_URL,
    // ssl: true,
    connectionString: `postgresql://${process.env.USER}:${process.env.PASSWORD}@localhost:${process.env.PORT || 5432}/${process.env.DATABASE}`,
});
