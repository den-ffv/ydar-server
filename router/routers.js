import { Router } from "express";
import UserController from "../controller/UserController.js";
import { check } from "express-validator";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import verifyMiddleware from "../middlewares/verifyMiddleware.js";
import EventController from "../controller/EventController.js";
import PostController from "../controller/PostController.js";
const router = new Router();

router.post("/register", [
    check("name", "user cannot be empty").notEmpty(),
    check("lastname", "lastname cannot be empty").notEmpty(),
    check("email", "please include an '@' symbol in your email address.").isEmail(),
    check("password", "The password cannot be shorter than 5 characters").isLength(5),
], UserController.registration);
router.post("/login", UserController.login);

router.post("/logout", UserController.logout);
router.get("/refresh", UserController.refresh);
router.get("/activate/:link", UserController.activate);

router.patch("/verify-user/:userId", roleMiddleware(['admin']), UserController.verifyUser);
router.get("/users", authMiddleware, verifyMiddleware, UserController.getUsers);

router.post("/event-create", roleMiddleware(['admin']), EventController.createEvent);
router.get("/event-readone/:id",EventController.readOneEvent);
router.get("/event-readall",EventController.readAllEvents);
router.delete("/event-delete/:id", roleMiddleware(['admin']), EventController.deleteEvent);
router.put("/event-update/:id", roleMiddleware(['admin']), EventController.updateEvent);

router.post("/post-create", roleMiddleware(['admin']), PostController.createPost);
router.get("/post-readone/:id",PostController.readOnePost);
router.get("/post-readall",PostController.readAllPost);
router.delete("/post-delete/:id", roleMiddleware(['admin']), PostController.deletePost);
router.put("/post-update/:id", roleMiddleware(['admin']), PostController.updatePost);
export default router 