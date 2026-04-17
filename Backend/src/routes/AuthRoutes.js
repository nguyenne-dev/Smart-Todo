const Router = require("express").Router();
const authController = require("../controllers/authController");
const validateEmail = require("../middlewares/validateEmail");

Router.post("/register", validateEmail, authController.register);
Router.get("/verify-register/:token", authController.verifyRegister);
Router.post("/login", authController.login);
Router.post("/logout", authController.logout);
Router.post("/forgot-password", validateEmail, authController.forgotPassword);
Router.post("/reset-password/:token", authController.resetPassword);

module.exports = Router;