import { Model, Schema } from "mongoose";
import catchAsync from "src/utils/catch-async";
import { IRequest } from "@shared/constants";
import { Response, NextFunction } from "express";
import User from "@entities/user";
import AppError from "src/utils/app-error";
import sendResponse from "src/utils/send-response";
import APIFeatures from "src/utils/api-features";
import { StatusCodes } from "http-status-codes";

const deleteFromUser = (Model: Model<any>, property: string, docId: string) =>
  catchAsync(async (req: IRequest, res: Response, next: NextFunction) => {
    let doc: any;
    if (docId) doc = req.params[docId];
    else
      await Model.findByIdAndDelete(req.params.id).then(
        (res) => (doc = res._id.toString())
      );
    await User.findByIdAndUpdate(req.user._id, {
      [property]: req.user
        .get(property)
        .filter((id: Schema.Types.ObjectId) => id.toString() !== doc),
    });
    if (!doc) return next(new AppError(404, "No document found with that ID"));
    sendResponse(null, 204, "Document deleted successfully.", res);
  });

const getFromUser = (
  Model: Model<any>,
  property: string,
  populatePath: string
) =>
  catchAsync(async (req: IRequest, res: Response) => {
    let query = Model.find({ _id: req.user.get(property) });
    if (populatePath) query = query.populate(populatePath);
    const doc = await query;
    sendResponse(doc, 200, "Documents fetched successfully.", res);
  });

const addToUser = (Model: Model<any>, property: string, docId: string) =>
  catchAsync(async (req: IRequest, res: Response) => {
    let doc;
    if (docId) doc = req.params[docId];
    else doc = await Model.create(req.body);
    req.user.get(property).push(doc);
    await User.findByIdAndUpdate(req.user._id, {
      [property]: req.user.get(property),
    });
    sendResponse(doc, 201, "Document added successfully.", res);
  });

const deleteOne = (Model: Model<any>) =>
  catchAsync(async (req: IRequest, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc)
      return next(
        new AppError(StatusCodes.NOT_FOUND, "No document found with that ID")
      );
    sendResponse(null, 204, "Document deleted successfully.", res);
  });

const getOne = (Model: Model<any>, populatePath: string) =>
  catchAsync(async (req: IRequest, res: Response, next: NextFunction) => {
    let query = Model.findById(req.params.id);
    if (populatePath) query = query.populate(populatePath);
    const doc = await query;
    if (!doc)
      return next(
        new AppError(StatusCodes.NOT_FOUND, "No document found with that ID")
      );
    sendResponse(doc, 200, "Document fetched successfully.", res);
  });

const updateOne = (Model: Model<any>) =>
  catchAsync(async (req: IRequest, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc)
      return next(
        new AppError(StatusCodes.NOT_FOUND, "No document found with that ID")
      );
    sendResponse(doc, 200, "Document updated successfully", res);
  });

const createOne = (Model: Model<any>) =>
  catchAsync(async (req: IRequest, res: Response, next: NextFunction) => {
    const doc = await Model.create(req.body);
    if (!doc)
      return next(new AppError(StatusCodes.NOT_FOUND, "Document not created."));
    sendResponse(doc, 201, "Document created successfully.", res);
  });

const getMultiple = (Model: Model<any>) =>
  catchAsync(async (req: IRequest, res: Response, next: NextFunction) => {
    let filter = {};
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields();
    // .paginate();
    let doc = await features.query;
    const totalResults = doc?.length;

    doc = await features.paginate().query;

    if (!doc) return next(new AppError(StatusCodes.NOT_FOUND, "Not found"));

    res.status(200).json({
      status: "success",
      total: totalResults,
      message: "Documents fetched successfully.",
      data: doc,
    });
    // sendResponse(doc, 200, "Documents fetched successfully.", res);
  });

export default {
  deleteFromUser,
  getFromUser,
  addToUser,
  deleteOne,
  getOne,
  updateOne,
  createOne,
  getMultiple,
};
