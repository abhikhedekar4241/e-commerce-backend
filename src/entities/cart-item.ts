import { Schema, Model, model, Document } from "mongoose";
import Item, { IItem } from "./item";

export interface ICartItem extends Document {
  item: Schema.Types.ObjectId | IItem;
  quantity: number;
  unitCost: number;
}

const schema = new Schema(
  {
    item: {
      type: Schema.Types.ObjectId,
      ref: Item,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unitCost: {
      type: Number,
      required: true,
    },
  },
  { versionKey: false }
);

const CartItem: Model<ICartItem> = model("CartItem", schema);

export default CartItem;
