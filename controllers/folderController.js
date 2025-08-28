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
