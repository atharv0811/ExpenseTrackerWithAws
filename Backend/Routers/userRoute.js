const express = require("express");
const userRouter = express.Router();
const userController = require("../Controllers/userController");

userRouter.get("/register", userController.getRegistrationPage);
userRouter.get("/login", userController.getLoginPage);
userRouter.post('/addUser', userController.addUser);
userRouter.post('/check-login', userController.checkLogin);
userRouter.get('/home', userController.getHome)

module.exports = userRouter;