const client = require("./client");

const createUser = async (username, password) => {
    const newFolder = await client.folder.create({
        data: {
            name: username,
        },
    });
    await client.user.create({
        data: {
            username: username,
            password: password,
            folderId: newFolder.id,
        },
    });
};

const getUserById = async (id) => {
    return await client.user.findUnique({
        where: {
            id: id,
        },
    });
};

const getUserByUsername = async (username) => {
    return await client.user.findUnique({
        where: {
            username: username,
        },
    });
};

module.exports = {
    createUser,
    getUserById,
    getUserByUsername,
};
