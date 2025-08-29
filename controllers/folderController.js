const db = require("../db/queries");
const supabase = require("../db/supabase");
const { validationResult, matchedData } = require("express-validator");
const {
    validateIdFactory,
    validateQueryId,
    validateNameFactory,
} = require("../middlewares/validators");

function fileFilter(req, file, cb) {
    // test if file extension has 3 characters
    if (/\.[A-Za-z]{3}$/.test(file.originalname)) {
        cb(null, true);
    }
    cb(null, false);
}

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1000000 },
});

const isAuthenticated = async (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.render("folder", { title: "Folder" });
    }
    next();
};

const getFolder = [
    isAuthenticated,
    validateQueryId,
    async (req, res) => {
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
    },
];

const createFolder = [
    isAuthenticated,
    validateIdFactory("parentId"),
    validateNameFactory("name"),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render("folder", {
                title: "Error",
                folder: null,
                errors: errors.array(),
            });
        }
        folder = await db.getFolderById(Number(req.body.parentId));
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
        await db.createFolder(folder.id, req.user.id, req.body.name);
        folder = await db.getFolderById(Number(req.body.parentId));
        res.render("folder", { title: folder.name, folder: folder });
    },
];

const renameFolder = [
    isAuthenticated,
    validateIdFactory("id"),
    validateNameFactory("name"),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render("folder", {
                title: "Error",
                folder: null,
                errors: errors.array(),
            });
        }
        const folder = await db.getFolderById(Number(req.body.id));
        if (req.user.id !== folder.userId || !folder) {
            return res.render("folder", {
                title: "Can't rename a folder you don't own!",
                folder: null,
            });
        }
        const parentId = folder.parentId;
        await db.renameFolderById(Number(req.body.id), req.body.name);
        const parentFolder = await db.getFolderById(parentId);
        return res.render("folder", {
            title: parentFolder.name,
            folder: parentFolder,
        });
    },
];

const deleteFolder = [
    isAuthenticated,
    validateIdFactory("id"),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render("folder", {
                title: "Error",
                folder: null,
                errors: errors.array(),
            });
        }
        const folder = await db.getFolderById(Number(req.body.id));
        if (req.user.id !== folder.userId || !folder) {
            return res.render("folder", {
                title: "Can't delete a folder you don't own!",
                folder: null,
            });
        }
        const parentId = folder.parentId;
        await db.deleteFolderById(Number(req.body.id));
        const parentFolder = await db.getFolderById(parentId);
        return res.render("folder", {
            title: parentFolder.name,
            folder: parentFolder,
        });
    },
];

const uploadFile = [
    upload.single("somefile"),
    isAuthenticated,
    validateIdFactory("parentId"),
    async (req, res) => {
        if (!req.file) {
            return res.render("folder", {
                title: "Error",
                folder: null,
                errors: [
                    {
                        msg: "File must have a 3 character extension and be less than 1MB in size",
                    },
                ],
            });
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render("folder", {
                title: "Error",
                folder: null,
                errors: errors.array(),
            });
        }
        let folder = await db.getFolderById(Number(req.body.parentId));
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

        const file = req.file;
        let filename;
        if (req.body.name) {
            filename = req.body.name + file.originalname.slice(-4);
        } else {
            filename = file.originalname;
        }
        const storedFile = new File(file.buffer, filename, {
            type: file.mimetype,
        });
        const storage = await supabase.storage
            .from("files")
            .upload(`${req.user.id}/${filename}`, storedFile);
        if (storage.error) {
            return res.render("folder", {
                title: storage.error.message,
                folder: null,
            });
        }
        const downloadUrl = supabase.storage
            .from("files")
            .getPublicUrl(storage.data.path, {
                download: true,
            });
        await db.createFile(
            folder.id,
            filename,
            storage.data.path,
            file.size / 1000,
            downloadUrl.data.publicUrl,
        );

        folder = await db.getFolderById(Number(req.body.parentId));
        return res.render("folder", { title: folder.name, folder: folder });
    },
];

const deleteFile = [
    isAuthenticated,
    validateIdFactory("id"),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render("folder", {
                title: "Error",
                folder: null,
                errors: errors.array(),
            });
        }
        const file = await db.getFileById(Number(req.body.id));
        if (file.folder.userId !== req.user.id) {
            return res.render("folder", {
                title: "Can't delete a file you don't own!",
                folder: null,
            });
        }
        const err = await supabase.storage.from("files").remove(file.path);
        if (err.error) {
            return res.render("folder", {
                title: err.message,
                folder: null,
            });
        }
        await db.deleteFileById(Number(req.body.id));
        const folder = await db.getFolderById(file.folder.id);
        return res.render("folder", {
            title: folder.name,
            folder: folder,
        });
    },
];

module.exports = {
    uploadFile,
    deleteFile,
    getFolder,
    createFolder,
    deleteFolder,
    renameFolder,
};
