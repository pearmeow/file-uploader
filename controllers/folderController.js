const db = require(""); // require db later

const getFolder = async (req, res) => {
    res.render("folder", { title: "Folder", folderId: 0 }); // render the user's default folderid as well
};

const createFolder = async (req, res) => {
    // use db create folder
    res.render("folder", { title: "Folder", folderId: 0 }); // render yourself again to show newly created folder
};

const uploadFile = async (req, res) => {
    // use db to upload file in folder
    res.render("folder", { folderId: 0 });
};

module.exports = {
    getFolder,
    createFolder,
    uploadFile,
};
