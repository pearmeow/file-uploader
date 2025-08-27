const pool = require("./pool");

// Sample queries: change as needed

async function getAllMessages() {
    const { rows } = await pool.query("SELECT * FROM messages");
    return rows;
}

async function getMessage(id) {
    const { rows } = await pool.query("SELECT * FROM messages where id=($1)", [
        id,
    ]);
    return rows;
}

async function insertMessage(msg, author) {
    await pool.query(
        "INSERT INTO messages (msg, author, date) values(($1), ($2), ($3))",
        [msg, author, datefns.format(new Date(), "yyyy-MM-dd")],
    );
}

module.exports = {
    insertMessage,
    getMessage,
    getAllMessages,
};
