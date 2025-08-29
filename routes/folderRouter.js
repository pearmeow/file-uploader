const folderController = require("../controllers/folderController");

const { Router } = require("express");

const folderRouter = Router();

folderRouter.get("/", folderController.getFolder);
folderRouter.get("/:folderId", folderController.getFolder);
folderRouter.post("/", folderController.createFolder);
folderRouter.post("/file", folderController.uploadFile);
folderRouter.post("/file/delete", folderController.deleteFile);
folderRouter.post("/delete", folderController.deleteFolder);
folderRouter.post("/rename", folderController.renameFolder);

module.exports = folderRouter;
