import { Router } from "express";
import userRoutes from "./userRouters.js";
import postRoutes from "./postRouters.js";
import eventRoutes from "./eventRouters.js";

const router = new Router();

router.use("/user", userRoutes);
router.use("/post", postRoutes);
router.use("/event", eventRoutes);

export default router;
