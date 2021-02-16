import { Router } from "express";
import { addressRouter, userRouter } from "src/routes/user";
import {
  categoryRouter,
  itemRouter,
  reviewRouter,
  subCategoryRouter,
} from "src/routes/inventory";
import { offerRouter } from "src/routes/offer";
import { bookingRouter } from "src/routes/booking";
import { adminRouter } from "src/routes/admin";
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

/**
 * Base api router.
 */
export default router;
