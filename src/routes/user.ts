import { Router } from "express";
import authController from "src/controllers/auth";
import userController from "src/controllers/user";

export const userRouter: Router = Router()
  // User authentication
  .post("/signup", authController.signUp)
  .post("/login", authController.login)
  .get("/logout", authController.logout)
  .post("/forgotPassword", authController.forgotPassword)
  .post("/resetPassword/:token", authController.resetPassword)

  // User cart
  .get("/cart", authController.protect, userController.getCartItems)
  .post("/cart", authController.protect, userController.addCartItem)
  .put("/cart/:id", authController.protect, userController.updateCartItem)
  .delete("/cart/:id", authController.protect, userController.deleteCartItem)

  // User wishList
  .get("/wishList", authController.protect, userController.getWishListItems)
  .post(
    "/wishList/:itemId",
    authController.protect,
    userController.addWishListItem
  )
  .delete(
    "/wishList/:itemId",
    authController.protect,
    userController.deleteWishListItem
  );

export const addressRouter: Router = Router()
  .get("/", authController.protect, userController.getAddresses)
  .get("/:id", authController.protect, userController.getAddress)
  .post("/", authController.protect, userController.addAddress)
  .put("/:id", authController.protect, userController.updateAddress)
  .delete("/:id", authController.protect, userController.deleteAddress);

export default {
  userRouter,
  addressRouter,
};
