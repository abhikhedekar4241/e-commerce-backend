import Category from "@entities/category";
import Item from "@entities/item";
import Review from "@entities/review";
import SubCategory from "@entities/sub-category";
import handler from "./handler";

// Category related
const getCategories = handler.getMultiple(Category);
const getCategoryData = handler.getOne(Category, "subCategories");
const addCategory = handler.createOne(Category);
const updateCategory = handler.updateOne(Category);
const deleteCategory = handler.deleteOne(Category);

// SubCategory related
const getSubCategories = handler.getMultiple(SubCategory);
const getSubCategoryData = handler.getOne(SubCategory, "items");
const addSubCategory = handler.createOne(SubCategory);
const updateSubCategory = handler.updateOne(SubCategory);
const deleteSubCategory = handler.deleteOne(SubCategory);

// Item related
const getItems = handler.getMultiple(Item);
const getItem = handler.getOne(Item, "reviews categoryId subCategoryId");
const addItem = handler.createOne(Item);
const updateItem = handler.updateOne(Item);
const deleteItem = handler.deleteOne(Item);

// Review related
const getReviews = handler.getMultiple(Review);
const getReview = handler.getOne(Review, "itemId");
const addReview = handler.createOne(Review);
const updateReview = handler.updateOne(Review);
const deleteReview = handler.deleteOne(Review);

export default {
  getCategories,
  getCategoryData,
  addCategory,
  updateCategory,
  deleteCategory,

  getSubCategories,
  getSubCategoryData,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,

  getItems,
  getItem,
  addItem,
  updateItem,
  deleteItem,

  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
};
