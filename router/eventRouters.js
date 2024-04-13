import { Router } from "express";
import EventController from "../controller/EventController.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const eventRoutes = Router();

eventRoutes.post("/event-create", roleMiddleware(['admin']), EventController.createEvent);
eventRoutes.get("/event-readone/:id",EventController.readOneEvent);
eventRoutes.get("/event-readall",EventController.readAllEvents);
eventRoutes.delete("/event-delete/:id", roleMiddleware(['admin']), EventController.deleteEvent);
eventRoutes.put("/event-update/:id", roleMiddleware(['admin']), EventController.updateEvent);

export default eventRoutes