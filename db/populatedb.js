#! /usr/bin/env node

const { Client } = require("pg");
const { argv } = require("node:process");
require("dotenv").config();

// Sample sql, change to fit database
const SQL = `
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  msg VARCHAR ( 255 ),
  author VARCHAR ( 255 ),
  date DATE
);

INSERT INTO messages (msg, author, date) 
VALUES
  ('Meow', 'Mahdi', '1983-10-20');
INSERT INTO messages (msg, author, date) 
VALUES
  ('Help me', 'Ivan', '2000-12-20');
INSERT INTO messages (msg, author, date) 
VALUES
  ('Hello', 'Perry', '1953-12-20');
`;

DB_URL =
    argv[2] ||
    `postgresql://${process.env.USER}:${process.env.PASSWORD}@localhost:${process.env.PORT || 5432}/${process.env.DATABASE}`;

async function main() {
    console.log("seeding...");
    const client = new Client({
        connectionString: DB_URL,
        ssl: argv[2] && true,
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("done");
}

main();
