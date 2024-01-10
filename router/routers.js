import { Router } from "express";
import multer from "multer";
import { check } from "express-validator";
import UserController from "../controller/UserController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import verifyMiddleware from "../middlewares/verifyMiddleware.js";
import passport from "../controller/GoogleAuth.js"; 
import storage from "../uploads/photoController.js";
const router = new Router();

const upload = multer({ storage });

router.post("/register", [
    check("name", "user cannot be empty").notEmpty(),
    check("lastname", "lastname cannot be empty").notEmpty(),
    check("email", "please include an '@' symbol in your email address.").isEmail(),
    check("password", "The password cannot be shorter than 5 characters").isLength(5),
], UserController.registration);
router.post("/login", UserController.login);


router.get("/auth/google", passport.authenticate('google',{scope: ['email', 'profile']} ))
router.get("/auth/google/callback",  passport.authenticate('google', { failureRedirect: '/help' }),
    (req, res) => {
    return res.redirect('/');
})
router.patch("/upload/avatar/:id",upload.single("file"),authMiddleware, UserController.addAvatar)
// app.post("/upload/avatar", upload.single("file"), (req, res) => { res.json(req.file);});

router.post("/logout", UserController.logout);
router.get("/refresh", UserController.refresh);
router.get("/activate/:link", UserController.activate);


router.patch("/verify-user/:id", roleMiddleware(['admin']), UserController.verifyUser);
router.get("/users", roleMiddleware(['admin', 'manager']), UserController.getUsers);
router.get("/user/:id", roleMiddleware(['admin', 'manager']), UserController.getUserByID);
router.delete("/delete/:id", roleMiddleware(['admin']), UserController.deleteUser);



export default router