import catchAsync from "../utils/catch-async";
import { IRequest } from "@shared/constants";
import { NextFunction } from "express";
import { Model } from "mongoose";
import AppError from "../utils/app-error";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../utils/send-response";
import { Response } from "express";
import APIFeatures from "../utils/api-features";

/**
 * Creates a document of the model passed as parameter.
 * @param Model Model to create document.
 */
const createOne = (Model: Model<any>) =>
  catchAsync(async (req: IRequest, res: Response, next: NextFunction) => {
    const doc = await Model.create(req.body);
    if (!doc)
      return next(
        new AppError(
          StatusCodes.EXPECTATION_FAILED,
          "Failed to create document."
        )
      );

    sendResponse(
      doc,
      StatusCodes.CREATED,
      "Document created successfully.",
      res
    );
  });

/**
 * Get multiple documents of the model passed as parameter. Applies filters passed in query.
 * @param Model Model from which documents are to be fetched.
 */
const getMultiple = (Model: Model<any>) =>
  catchAsync(async (req: IRequest, res: Response, next: NextFunction) => {
    const features = new APIFeatures(Model.find({}), req.query)
      .filter()
      .sort()
      .limitFields();
    //   .paginate();
    let doc = await features.query;
    const totalRecords = doc?.length;

    doc = await features.paginate().query;

    if (!doc)
      return next(
        new AppError(StatusCodes.NOT_IMPLEMENTED, "Failed to fetch documents.")
      );

    res.status(StatusCodes.OK).json({
      totalRecords,
      message: "Documents fetched successfully.",
      data: doc,
    });
  });

/**
 * Get single document of the model passed as parameter and document id passed in requested query.
 * @param Model Model from which document is to be fetched.
 * @param populateFields Name of fields to populate. (Separated by space.)
 */
const getOne = (Model: Model<any>, populateFields: string) =>
  catchAsync(async (req: IRequest, res: Response, next: NextFunction) => {
    let query = Model.findById(req.params.id);
    if (populateFields) query = query.populate(populateFields);
    const doc = await query;
    if (!doc)
      return next(
        new AppError(StatusCodes.NOT_FOUND, "Failed to fetch document.")
      );
    sendResponse(doc, StatusCodes.OK, "Document fetched successfully.", res);
  });

/**
 * Update document of the model passed as parameter and document id passed in requested query.
 * @param Model Model from which document needs to be updated.
 */
const updateOne = (Model: Model<any>) =>
  catchAsync(async (req: IRequest, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc)
      return next(
        new AppError(StatusCodes.NOT_MODIFIED, "Failed to update document.")
      );
    sendResponse(doc, StatusCodes.OK, "Document updated successfully.", res);
  });

/**
 * Delete document of the model passed as parameter and document id passed in requested query.
 * @param Model Model from which document needs to be deleted.
 */
const deleteOne = (Model: Model<any>) =>
  catchAsync(async (req: IRequest, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc)
      return next(
        new AppError(
          StatusCodes.EXPECTATION_FAILED,
          "Failed to delete document."
        )
      );
    sendResponse(
      null,
      StatusCodes.NO_CONTENT,
      "Document deleted successfully.",
      res
    );
  });

export default {
  createOne,
  getOne,
  getMultiple,
  updateOne,
  deleteOne,
};
