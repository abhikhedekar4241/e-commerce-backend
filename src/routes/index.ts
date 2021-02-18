import { Router } from "express";
import { addressRouter, userRouter } from "./user";
import {
  categoryRouter,
  itemRouter,
  reviewRouter,
  subCategoryRouter,
} from "./inventory";
import { offerRouter } from "./offer";
import { bookingRouter } from "./booking";
import { adminRouter } from "./admin";
import { settingsRouter } from "./settings";

// Init router and path
const router = Router();

// Add sub-routes
router.use("/admin", adminRouter);
router.use("/user", userRouter);
router.use("/address", addressRouter);
router.use("/category", categoryRouter);
router.use("/subCategory", subCategoryRouter);
router.use("/item", itemRouter);
router.use("/review", reviewRouter);
router.use("/offer", offerRouter);
router.use("/booking", bookingRouter);
router.use("/settings", settingsRouter);

/**
 * Base api router.
 */
export default router;
