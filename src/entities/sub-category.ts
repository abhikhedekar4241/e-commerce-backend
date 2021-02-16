import { Schema, Document, Model, model } from "mongoose";
import Category, { ICategory } from "./category";

export interface ISubCategory extends Document {
  name: string;
  image: string;
  categoryId: Schema.Types.ObjectId | ICategory;
  active: boolean;
  description: string;
}

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: Category.modelName,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
    },
  },
  { versionKey: false }
);

const SubCategory: Model<ISubCategory> = model("SubCategory", schema);

export default SubCategory;
