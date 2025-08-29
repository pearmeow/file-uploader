const db = require("../db/queries");
const supabase = require("../db/supabase");
const { validationResult } = require("express-validator");
const {
    validateIdFactory,
    validateQueryId,
    validateNameFactory,
} = require("../middlewares/validators");
const { File } = require("node:buffer");

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
        return res.redirect("/noaccess");
    }
    next();
};

const getFolder = [
    isAuthenticated,
    validateQueryId("folderId"),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render("folder", {
                title: "Error",
                folder: null,
                errors: errors.array(),
            });
        }
        let folder;
        try {
            if (req.params.folderId) {
                folder = await db.getFolderById(Number(req.params.folderId));
            } else {
                folder = await db.getFolderById(req.user.folderId);
            }
        } catch (err) {
            return next(err);
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
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render("folder", {
                title: "Error",
                folder: null,
                errors: errors.array(),
            });
        }
        try {
            folder = await db.getFolderById(Number(req.body.parentId));
        } catch (err) {
            return next(err);
        }
        if (!folder || folder.userId !== req.user.id) {
            return res.redirect("/noaccess");
        }
        try {
            await db.createFolder(folder.id, req.user.id, req.body.name);
            folder = await db.getFolderById(Number(req.body.parentId));
            res.redirect(`/folder/${req.body.parentId}`);
        } catch (err) {
            return next(err);
        }
    },
];

const renameFolder = [
    isAuthenticated,
    validateIdFactory("id"),
    validateNameFactory("name"),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render("folder", {
                title: "Error",
                folder: null,
                errors: errors.array(),
            });
        }
        try {
            const folder = await db.getFolderById(Number(req.body.id));
            if (!folder || req.user.id !== folder.userId || !folder) {
                return res.redirect("/noaccess");
            }
            const parentId = folder.parentId;
            await db.renameFolderById(Number(req.body.id), req.body.name);
            const parentFolder = await db.getFolderById(parentId);
            return res.render("folder", {
                title: parentFolder.name,
                folder: parentFolder,
            });
        } catch (err) {
            return next(err);
        }
    },
];

const deleteFolder = [
    isAuthenticated,
    validateIdFactory("id"),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render("folder", {
                title: "Error",
                folder: null,
                errors: errors.array(),
            });
        }
        try {
            const folder = await db.getFolderById(Number(req.body.id));
            if (req.user.id !== folder.userId || !folder) {
                return res.redirect("/noaccess");
            }
            const parentId = folder.parentId;
            await db.deleteFolderById(Number(req.body.id));
            const parentFolder = await db.getFolderById(parentId);
            return res.render("folder", {
                title: parentFolder.name,
                folder: parentFolder,
            });
        } catch (err) {
            next(err);
        }
    },
];

const uploadFile = [
    upload.single("somefile"),
    isAuthenticated,
    validateIdFactory("parentId"),
    async (req, res, next) => {
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
        let folder;
        try {
            folder = await db.getFolderById(Number(req.body.parentId));
        } catch (err) {
            return next(err);
        }
        if (folder.userId !== req.user.id) {
            return res.redirect("/noaccess");
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
        const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const storage = await supabase.storage
            .from("files")
            .upload(`${req.user.id}/${uniquePrefix + filename}`, storedFile);
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
        try {
            await db.createFile(
                folder.id,
                filename,
                storage.data.path,
                file.size / 1000,
                downloadUrl.data.publicUrl,
            );

            folder = await db.getFolderById(Number(req.body.parentId));
            return res.render("folder", { title: folder.name, folder: folder });
        } catch (err) {
            next(err);
        }
    },
];

const deleteFile = [
    isAuthenticated,
    validateIdFactory("id"),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render("folder", {
                title: "Error",
                folder: null,
                errors: errors.array(),
            });
        }
        let file;
        try {
            file = await db.getFileById(Number(req.body.id));
        } catch (err) {
            return next(err);
        }
        if (!file || file.folder.userId !== req.user.id) {
            return res.redirect("/noaccess");
        }
        const err = await supabase.storage.from("files").remove(file.path);
        if (err.error) {
            return res.render("folder", {
                title: err.message,
                folder: null,
            });
        }
        try {
            await db.deleteFileById(Number(req.body.id));
            const folder = await db.getFolderById(file.folder.id);
            return res.render("folder", {
                title: folder.name,
                folder: folder,
            });
        } catch (err) {
            next(err);
        }
    },
];

const getFile = [
    isAuthenticated,
    validateQueryId("fileId"),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render("file", { errors: errors.array() });
        }
        let file;
        try {
            file = await db.getFileById(Number(req.params.fileId));
        } catch (err) {
            return next(err);
        }
        if (!file || file.folder.userId !== req.user.id) {
            return res.redirect("/noaccess");
        }
        res.render("file", { file: file });
    },
];

module.exports = {
    uploadFile,
    deleteFile,
    getFile,
    getFolder,
    createFolder,
    deleteFolder,
    renameFolder,
};
