import Address from "@entities/Address";
import CartItem from "@entities/cart-item";
import Item from "@entities/item";
import userHandler from "./user-handler";

const getCartItems = userHandler.getFromUser(CartItem, "cartItems", "item");
const addCartItem = userHandler.addToUser(CartItem, "cartItems", "");
const updateCartItem = userHandler.updateOne(CartItem);
const deleteCartItem = userHandler.deleteFromUser(CartItem, "cartItems", "");

const getAddresses = userHandler.getFromUser(Address, "addresses", "");
const getAddress = userHandler.getOne(Address, "");
const addAddress = userHandler.addToUser(Address, "addresses", "");
const updateAddress = userHandler.updateOne(Address);
const deleteAddress = userHandler.deleteFromUser(Address, "addresses", "");

const getWishListItems = userHandler.getFromUser(Item, "wishList", "");
const addWishListItem = userHandler.addToUser(Item, "wishList", "itemId");
const deleteWishListItem = userHandler.deleteFromUser(
  Item,
  "wishList",
  "itemId"
);

export default {
  getCartItems,
  addCartItem,
  updateCartItem,
  deleteCartItem,
  getAddresses,
  getAddress,
  addAddress,
  updateAddress,
  deleteAddress,
  getWishListItems,
  addWishListItem,
  deleteWishListItem,
};
