const { Router } = require("express");
const userController = require("../controllers/userController");

const indexRouter = Router();

indexRouter.get("/", userController.getLogin);
indexRouter.post("/", userController.postLogin);
indexRouter.get("/register", userController.getRegister);
indexRouter.post("/register", userController.postRegister);
indexRouter.get("/logout", userController.getLogout);

module.exports = indexRouter;
