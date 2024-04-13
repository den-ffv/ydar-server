import { Router } from "express";
import multer from "multer";
import { check } from "express-validator";

import passport from "../controller/GoogleAuth.js"; 
import UserController from "../controller/UserController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

import {storage} from "../config/photoController.js"

const userRoutes = Router();
const upload = multer({ storage });

userRoutes.post("/register", [
    check("name", "user cannot be empty").notEmpty(),
    check("lastname", "lastname cannot be empty").notEmpty(),
    check("email", "please include an '@' symbol in your email address.").isEmail(),
    check("password", "The password cannot be shorter than 5 characters").isLength(5),
], UserController.registration);
userRoutes.post("/login", UserController.login);


userRoutes.get("/auth/google", passport.authenticate('google',{scope: ['email', 'profile']} ))
userRoutes.get("/auth/google/callback",  passport.authenticate('google', { failureRedirect: '/help' }),
    (req, res) => {
    return res.redirect('/');
})
userRoutes.patch("/upload/avatar/:id", upload.single("file"),authMiddleware, UserController.addAvatar)
// app.post("/upload/avatar", upload.single("file"), (req, res) => { res.json(req.file);});

// ----
userRoutes.post("/logout", UserController.logout);
userRoutes.get("/refresh", UserController.refresh);
// ----

userRoutes.get("/activate/:link", UserController.activate);
userRoutes.patch("/verify/:id", roleMiddleware(['admin']), UserController.verifyUser);
userRoutes.get("/get-all", roleMiddleware(['admin', 'manager']), UserController.getUsers);
userRoutes.get("/:id", roleMiddleware(['admin', 'manager']), UserController.getUserByID);
userRoutes.delete("/delete/:id", roleMiddleware(['admin']), UserController.deleteUser);


export default userRoutes