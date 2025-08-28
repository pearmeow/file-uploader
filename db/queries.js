const client = require("./client");

const createUser = async (username, password) => {
    const newFolder = await client.folder.create({
        data: {
            name: username,
        },
    });
    const user = await client.user.create({
        data: {
            username: username,
            password: password,
            folderId: newFolder.id,
        },
    });
    await client.folder.update({
        where: {
            id: newFolder.id,
        },
        data: {
            userId: user.id,
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

const getFolderById = async (id) => {
    return await client.folder.findUnique({
        where: {
            id: id,
        },
        include: {
            files: true,
            subfolders: true,
        },
    });
};

module.exports = {
    createUser,
    getUserById,
    getUserByUsername,
    getFolderById,
};
