const express=require('express');
const { register,login,logout,userProfile,checkAuth } = require('../controllers/usersController.js')
const isAuthenticated  = require('../middlewares/isAuthenticated.js');

const usersRouter = express.Router();

usersRouter.post("/register",register);
usersRouter.post("/login",login);
usersRouter.post("/logout",logout);
usersRouter.get("/userProfile", isAuthenticated , userProfile);
usersRouter.get("/auth/check", isAuthenticated , checkAuth);


module.exports = usersRouter;




