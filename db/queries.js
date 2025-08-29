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
            files: {
                orderBy: {
                    name: "asc",
                },
            },
            subfolders: {
                orderBy: {
                    name: "asc",
                },
            },
        },
    });
};

const createFolder = async (parentId, userId, name) => {
    return await client.folder.create({
        data: {
            parentId: parentId,
            userId: userId,
            name: name,
        },
        include: {
            files: true,
            subfolders: true,
        },
    });
};

const createFile = async (parentId, name, path, size, url) => {
    return await client.file.create({
        data: {
            folderId: parentId,
            name: name || url,
            path: path,
            size: size,
            url: url,
        },
    });
};

const getFileById = async (id) => {
    return await client.file.findUnique({
        where: {
            id: id,
        },
        include: {
            folder: true,
        },
    });
};

const deleteFileById = async (id) => {
    return await client.file.delete({
        where: {
            id: id,
        },
    });
};

const renameFolderById = async (id, name) => {
    return await client.folder.update({
        where: {
            id: id,
        },
        data: {
            name: name,
        },
    });
};

const deleteFolderById = async (id) => {
    return await client.folder.delete({
        where: {
            id: id,
        },
    });
};

module.exports = {
    createUser,
    getUserById,
    getUserByUsername,
    getFolderById,
    createFile,
    getFileById,
    deleteFileById,
    createFolder,
    deleteFolderById,
    renameFolderById,
};
