import { Document, Schema, Model, model } from "mongoose";
import CartItem, { ICartItem } from "./cart-item";
import User from "./user";
import { IUser } from "@entities/user";

export interface IBooking extends Document {
  status: string;
  user: Schema.Types.ObjectId | IUser;
  amount: number;
  cart: Schema.Types.ObjectId[] | ICartItem[];
  shipping: number;
  payment: string;
  allocatedTo: Schema.Types.ObjectId | IUser;
}

const schema: Schema = new Schema(
  {
    status: {
      type: String,
      enum: ["placed", "shipped", "delivered", "cancelled"],
      default: "placed",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: [true, "User id is required while booking."],
    },
    amount: {
      type: Number,
    },
    cart: [
      {
        type: Schema.Types.ObjectId,
        ref: CartItem.modelName,
      },
    ],
    shipping: Number,
    payment: {
      type: String,
      enum: ["cod", "paid"],
    },
    allocatedTo: {
      type: Schema.Types.ObjectId,
      ref: User.modelName,
    },
  },
  { versionKey: false }
);

const Booking: Model<IBooking> = model("Booking", schema);

export default Booking;
