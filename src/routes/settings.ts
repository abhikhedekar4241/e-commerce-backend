import { RequestHandler, Router } from "express";
import authController from "../controllers/auth";
import settingsController from "../controllers/settings";

/**
 * Handles settings related routes.
 */
export const settingsRouter = Router()
  .get(
    "/banner",
    authController.protect,
    authController.restrictTo("admin") as RequestHandler,
    settingsController.getBannerImages
  )
  .put(
    "/banner",
    authController.protect,
    authController.restrictTo("admin") as RequestHandler,
    settingsController.updateBannerImages
  )

  .get(
    "/coupon",
    authController.protect,
    authController.restrictTo("admin") as RequestHandler,
    settingsController.getCoupons
  )
  .put(
    "/coupon",
    authController.protect,
    authController.restrictTo("admin") as RequestHandler,
    settingsController.updateCoupons
  )

  .get(
    "/app-settings",
    authController.protect,
    authController.restrictTo("admin") as RequestHandler,
    settingsController.getAppSettings
  )
  .put(
    "/app-settings",
    authController.protect,
    authController.restrictTo("admin") as RequestHandler,
    settingsController.updateAppSettings
  )

  .get(
    "/back-panel-settings",
    authController.protect,
    authController.restrictTo("admin") as RequestHandler,
    settingsController.getBackPanelSettings
  )
  .put(
    "/back-panel-settings",
    authController.protect,
    authController.restrictTo("admin") as RequestHandler,
    settingsController.updateBackPanelSettings
  );

export default { settingsRouter };
