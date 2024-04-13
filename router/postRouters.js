import { Router } from "express";

import PostController from "../controller/PostController.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const postRoutes = Router();
postRoutes.post("/post-create", roleMiddleware(['admin']), PostController.createPost);
postRoutes.get("/post-readone/:id",PostController.readOnePost);
postRoutes.get("/post-readall",PostController.readAllPost);
postRoutes.delete("/post-delete/:id", roleMiddleware(['admin']), PostController.deletePost);
postRoutes.put("/post-update/:id", roleMiddleware(['admin']), PostController.updatePost);

export default postRoutes