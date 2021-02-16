import { RequestHandler, Router } from "express";
import inventory from "../controllers/inventory";
import authController from "../controllers/auth";

/**
 * Handles Category related routes.
 */
export const categoryRouter = Router()
  .get("/", inventory.getCategories)
  .get("/:id", inventory.getCategoryData)
  .post(
    "/",
    authController.protect,
    authController.restrictTo("admin") as RequestHandler,
    inventory.addCategory
  )
  .put(
    "/:id",
    authController.protect,
    authController.restrictTo("admin") as RequestHandler,
    inventory.updateCategory
  )
  .delete(
    "/:id",
    authController.protect,
    authController.restrictTo("admin") as RequestHandler,
    inventory.deleteCategory
  );

/**
 * Handles SubCategory related routes.
 */
export const subCategoryRouter = Router()
  .get("/:id", inventory.getSubCategoryData)
  .get("/", inventory.getSubCategories)
  .post(
    "/",
    authController.protect,
    authController.restrictTo("admin") as RequestHandler,
    inventory.addSubCategory
  )
  .put(
    "/:id",
    authController.protect,
    authController.restrictTo("admin") as RequestHandler,
    inventory.updateSubCategory
  )
  .delete(
    "/:id",
    authController.protect,
    authController.restrictTo("admin") as RequestHandler,
    inventory.deleteSubCategory
  );

/**
 * Handles Item related routes.
 */
export const itemRouter = Router()
  .get("/:id", inventory.getItem)
  .get("/", inventory.getItems)
  .post(
    "/",
    authController.protect,
    authController.restrictTo("admin") as RequestHandler,
    inventory.addItem
  )
  .put(
    "/:id",
    authController.protect,
    authController.restrictTo("admin") as RequestHandler,
    inventory.updateItem
  )
  .delete(
    "/:id",
    authController.protect,
    authController.restrictTo("admin") as RequestHandler,
    inventory.deleteItem
  );

/**
 * Handles Review related routes.
 */
export const reviewRouter = Router()
  .get("/", inventory.getReviews)
  .get("/:id", inventory.getReview)
  .post("/", authController.protect, inventory.addReview)
  .put("/:id", authController.protect, inventory.updateReview)
  .delete("/:id", authController.protect, inventory.deleteReview);

export default {
  categoryRouter,
  subCategoryRouter,
  itemRouter,
  reviewRouter,
};
