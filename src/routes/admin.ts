import { RequestHandler, Router } from "express";
import adminController from "../controllers/admin";
import authController from "../controllers/auth";

/**
 * Handles admin routes.
 */
export const adminRouter = Router()
  .get(
    "/dashboard",
    authController.protect,
    authController.restrictTo("admin") as RequestHandler,
    adminController.getDashboardData
  )
  .get(
    "/booking",
    authController.protect,
    authController.restrictTo("admin") as RequestHandler,
    adminController.getBookings
  )
  .put(
    "/booking",
    authController.protect,
    authController.restrictTo("admin") as RequestHandler,
    adminController.updateBooking
  )

  .get(
    "/push-notification",
    authController.protect,
    authController.restrictTo("admin") as RequestHandler,
    adminController.sendPushNotification
  )

  .delete(
    "/drop",
    authController.protect,
    authController.restrictTo("admin") as RequestHandler,
    adminController.dropAll
  );

/*
 * 1. Get bookings
 * 2. Banner images
 * 3. coupons
 * 4. push notifications
 * 5. App settings
 * 6. Back panel settings
 * 7. dashboard
 * */

export default { adminRouter };
