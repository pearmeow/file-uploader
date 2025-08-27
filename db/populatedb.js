const { PrismaClient } = require("../src/generated/prisma");
const db = require("./queries");
const { hashPassword } = require("../utils/authenticate");

const client = new PrismaClient();

async function main() {
    await client.user.deleteMany();
    await client.file.deleteMany();
    await client.folder.deleteMany();
    await db.createUser("pearmeow", await hashPassword("meowmeow"));
    await db.createUser("mahdi", await hashPassword("imstupid"));
    await db.createUser("tahrim", await hashPassword("imnotstupid"));
    console.log(await client.folder.findMany());
    console.log(await client.file.findMany());
    console.log(await client.user.findMany());
}

main();
