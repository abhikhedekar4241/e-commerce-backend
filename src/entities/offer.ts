import { Document, Schema, Model, model } from "mongoose";

export interface IOffer extends Document {}

const schema = new Schema({}, { versionKey: false });

const Offer: Model<IOffer> = model("Offer", schema);

export default Offer;
