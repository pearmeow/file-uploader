const db = require("../db/queries"); // require db later

const getFolder = async (req, res) => {
    if (req.isAuthenticated()) {
        let folder;
        if (req.params.folderId) {
            folder = await db.getFolderById(Number(req.params.folderId));
        } else {
            folder = await db.getFolderById(req.user.folderId);
        }
        if (folder.userId !== req.user.id) {
            return res.render("folder", {
                title: "You do not have access to this folder!",
                folder: null,
            });
        }
        return res.render("folder", { title: folder.name, folder: folder });
    }
    res.render("folder", { title: "Folder" });
};

// TODO: add checks for folder name and id
const createFolder = async (req, res) => {
    // TODO: use db create folder
    // change folder to not null
    res.render("folder", { title: "Folder", folder: null });
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
