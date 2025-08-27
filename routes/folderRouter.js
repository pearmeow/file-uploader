const folderController = require("../controllers/folderController");

const { Router } = require("express");

const folderRouter = Router();

folderRouter.get("/", folderController.getFolder);
folderRouter.post("/", folderController.createFolder);
folderRouter.post("/file", folderController.uploadFile);

module.exports = folderRouter;
