import catchAsync from "src/utils/catch-async";
import { IRequest } from "@shared/constants";
import { Response } from "express";
import mongoose from "mongoose";
import sendResponse from "src/utils/send-response";
import handler from "src/controllers/handler";
import Booking from "@entities/booking";

const dropAll = catchAsync(async (req: IRequest, res: Response) => {
  await mongoose.connection.db.dropDatabase();
  sendResponse(null, 204, null, res);
});

const getDashboardData = catchAsync(async () => {});

const getBookings = handler.getMultiple(Booking);
const updateBooking = handler.updateOne(Booking);

const getBannerImages = catchAsync(async () => {});
const updateBannerImages = catchAsync(async () => {});

const getCoupons = catchAsync(async () => {});
const updateCoupons = catchAsync(async () => {});

const sendPushNotification = catchAsync(async () => {});

const getAppSettings = catchAsync(async () => {});
const updateAppSettings = catchAsync(async () => {});

const getBackPanelSettings = catchAsync(async () => {});
const updateBackPanelSettings = catchAsync(async () => {});

export default {
  dropAll,
  getDashboardData,
  getBookings,
  updateBooking,
  getBannerImages,
  updateBannerImages,
  getCoupons,
  updateCoupons,
  sendPushNotification,
  getAppSettings,
  updateAppSettings,
  getBackPanelSettings,
  updateBackPanelSettings,
};
