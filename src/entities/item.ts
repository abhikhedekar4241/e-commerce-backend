import { Schema, Document, Model, model } from "mongoose";
import Category, { ICategory } from "./category";
import SubCategory, { ISubCategory } from "./sub-category";

export interface IItemOption extends Document {
  name: string;
  quantity: number;
  unit: string;
  group: string;
  price: number;
  stock: number;
  discount: number;
  discountUnit: string;
}

export interface IItem extends Document {
  name: string;
  images: string[];
  active: boolean;
  featured: boolean;
  options: IItemOption[];
  description: string;
  categoryId: Schema.Types.ObjectId | ICategory;
  subCategoryId: Schema.Types.ObjectId | ISubCategory;
}

const itemOption = new Schema({
  name: {
    type: String,
    required: [true, "Option name is required."],
  },
  quantity: Number,
  unit: String,
  group: String,
  price: {
    type: Number,
    required: [true, "Item price is required."],
  },
  stock: Number,
  discount: Number,
  discountUnit: {
    type: String,
    enum: ["percent", "amount"],
  },
});

const schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required."],
    },
    images: {
      type: [String],
      default: ["https://picsum.photos/200", "https://picsum.photos/200"],
    },
    active: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: true,
    },
    options: [
      {
        type: itemOption,
      },
    ],
    description: {
      type: String,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: Category.modelName,
      required: true,
    },
    subCategoryId: {
      type: Schema.Types.ObjectId,
      ref: SubCategory.modelName,
      required: true,
    },
  },
  { versionKey: false }
);

const Item: Model<IItem> = model("Item", schema);

export default Item;
