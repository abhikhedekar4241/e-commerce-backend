import { RequestHandler, Router } from "express";
import adminController from "src/controllers/admin";
import authController from "src/controllers/auth";

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
    "/banner",
    authController.protect,
    authController.restrictTo("admin") as RequestHandler,
    adminController.getBannerImages
  )
  .put(
    "/banner",
    authController.protect,
    authController.restrictTo("admin") as RequestHandler,
    adminController.updateBannerImages
  )

  .get(
    "/coupon",
    authController.protect,
    authController.restrictTo("admin") as RequestHandler,
    adminController.getCoupons
  )
  .put(
    "/coupon",
    authController.protect,
    authController.restrictTo("admin") as RequestHandler,
    adminController.updateCoupons
  )

  .get(
    "/push-notification",
    authController.protect,
    authController.restrictTo("admin") as RequestHandler,
    adminController.sendPushNotification
  )

  .get(
    "/app-settings",
    authController.protect,
    authController.restrictTo("admin") as RequestHandler,
    adminController.getAppSettings
  )
  .put(
    "/app-settings",
    authController.protect,
    authController.restrictTo("admin") as RequestHandler,
    adminController.updateAppSettings
  )

  .get(
    "/back-panel-settings",
    authController.protect,
    authController.restrictTo("admin") as RequestHandler,
    adminController.getBackPanelSettings
  )
  .put(
    "/back-panel-settings",
    authController.protect,
    authController.restrictTo("admin") as RequestHandler,
    adminController.updateBackPanelSettings
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
