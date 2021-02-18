import { IRequest } from "@shared/constants";
import { NextFunction, Response } from "express";
import catchAsync from "../utils/catch-async";
import fs from "fs";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../utils/send-response";

const getFromFile = (fileName: string) =>
  catchAsync(async (req: IRequest, res: Response, next: NextFunction) => {
    fs.readFile(fileName, (err, data) => {
      if (err) throw err;
      const settings = JSON.parse((data as unknown) as string);
      sendResponse(settings, StatusCodes.OK, "Fetched successfully.", res);
    });
  });

const updateFile = (fileName: string) =>
  catchAsync(async (req: IRequest, res: Response, next: NextFunction) => {
    fs.writeFile(fileName, JSON.stringify(req.body), (err) => {
      if (err) throw err;
      fs.readFile(fileName, (err, data) => {
        if (err) throw err;
        const settings = JSON.parse((data as unknown) as string);
        sendResponse(settings, StatusCodes.OK, "Updated successfully.", res);
      });
    });
  });

const getBannerImages = getFromFile(`${process.env.BANNER_IMAGES}`);
const updateBannerImages = updateFile(`${process.env.BANNER_IMAGES}`);

const getCoupons = getFromFile(`${process.env.COUPONS}`);
const updateCoupons = updateFile(`${process.env.COUPONS}`);

const getAppSettings = getFromFile(`${process.env.APP_SETTINGS}`);
const updateAppSettings = updateFile(`${process.env.APP_SETTINGS}`);

const getBackPanelSettings = catchAsync(async () => {});
const updateBackPanelSettings = catchAsync(async () => {});

export default {
  getBannerImages,
  updateBannerImages,
  getCoupons,
  updateCoupons,
  getAppSettings,
  updateAppSettings,
  getBackPanelSettings,
  updateBackPanelSettings,
};
