import { Document, Schema, Model, model } from "mongoose";
import Item, { IItem } from "./item";

export interface IReview extends Document {
  title: string;
  description: string;
  images: string[];
  rating: string;
  itemId: Schema.Types.ObjectId | IItem;
}

const schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Review title is required."],
    },
    description: {
      type: String,
    },
    images: {
      type: [String],
      default: ["https://picsum.photos/200", "https://picsum.photos/200"],
    },
    rating: {
      type: String,
      required: [true, "Rating is required."],
    },
    itemId: {
      type: Schema.Types.ObjectId,
      ref: Item.modelName,
      required: true,
    },
  },
  { versionKey: false }
);

const Review: Model<IReview> = model("Review", schema);

export default Review;
