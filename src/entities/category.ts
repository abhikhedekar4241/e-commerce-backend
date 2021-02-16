import { Schema, Model, model, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  image: string;
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

const Category: Model<ICategory> = model("Category", schema);

export default Category;
