import { Router } from "express";
import authController from "../controllers/auth";
import bookingController from "../controllers/booking";

/**
 * Handles booking related routes.
 */
export const bookingRouter = Router()
  .get("/", authController.protect, bookingController.getBookings)
  .get("/:id", authController.protect, bookingController.getBooking)
  .post("/", authController.protect, bookingController.addBooking)
  .put("/", authController.protect, bookingController.updateBooking)
  .delete("/", authController.protect, bookingController.deleteBooking);

export default { bookingRouter };
