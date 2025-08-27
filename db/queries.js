const client = require("./client");

const createUser = async (username, password) => {
    const newFolder = await client.folder.create({
        data: {
            name: username,
        },
    });
    client.user.create({
        data: {
            username: username,
            password: password,
            folderId: newFolder.id,
        },
    });
};

module.exports = {
    createUser,
};
