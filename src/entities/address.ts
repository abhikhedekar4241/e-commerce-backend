import { Document, Schema, Model, model } from "mongoose";

export interface IAddress extends Document {
  latitude: string;
  longitude: string;
  country: string;
  state: string;
  zipCode: string;
  area: string;
  landmark: string;
  houseNo: string;
  type: string;
}

const schema: Schema = new Schema(
  {
    latitude: {
      type: String,
      required: [true, "Latitude required for location."],
    },
    longitude: {
      type: String,
      required: [true, "Longitude required for location."],
    },
    country: {
      type: String,
    },
    state: {
      type: String,
    },
    pinCode: {
      type: String,
      required: true,
    },
    area: {
      type: String,
    },
    landmark: {
      type: String,
    },
    houseNo: {
      type: String,
    },
    type: {
      type: String,
      enum: ["home", "office"],
      default: "home",
    },
  },
  { versionKey: false }
);

const Address: Model<IAddress> = model("Address", schema);

export default Address;
