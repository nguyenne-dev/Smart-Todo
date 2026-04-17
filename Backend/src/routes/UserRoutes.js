const Router = require("express").Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

// Apply authentication middleware to all routes in this router
Router.use(authMiddleware);

Router.get("/me" , userController.getMe);
Router.patch("/me" , userController.updateMe);
Router.patch("/change-password" , userController.changePassword);

module.exports = Router;