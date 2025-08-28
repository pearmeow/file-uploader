const db = require("../db/queries");
const { validationResult, matchedData } = require("express-validator");
const {
    validateIdFactory,
    validateQueryId,
    validateFolderName,
} = require("../middlewares/validators");

const getFolder = [
    validateQueryId,
    async (req, res) => {
        if (req.isAuthenticated()) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.render("folder", {
                    title: "Error",
                    folder: null,
                    errors: errors.array(),
                });
            }
            let folder;
            if (req.params.folderId) {
                folder = await db.getFolderById(Number(req.params.folderId));
            } else {
                folder = await db.getFolderById(req.user.folderId);
            }
            if (!folder) {
                return res.render("folder", {
                    title: "Folder not found",
                    folder: null,
                });
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
    },
];

const createFolder = [
    validateIdFactory("parentId"),
    validateFolderName,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render("folder", {
                title: "Error",
                folder: null,
                errors: errors.array(),
            });
        }
        const folder = await db.getFolderById(Number(req.body.parentId));
        if (folder.userId !== req.user.id) {
            return res.render("folder", {
                title: "You do not have access to this folder!",
                folder: null,
            });
        }
        if (!req.user) {
            return res.render("folder", {
                title: "You do not have access to this folder!",
                folder: null,
            });
        }
        const newFolder = await db.createFolder(
            folder.id,
            req.user.id,
            req.body.name,
        );
        res.render("folder", { title: newFolder.name, folder: newFolder });
    },
];

const uploadFile = async (req, res) => {
    // use db to upload file in folder
    res.render("folder", { folderId: 0 });
};

module.exports = {
    getFolder,
    createFolder,
    uploadFile,
};
