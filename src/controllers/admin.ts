import catchAsync from "../utils/catch-async";
import { IRequest } from "@shared/constants";
import { NextFunction, Response } from "express";
import mongoose from "mongoose";
import sendResponse from "../utils/send-response";
import handler from "./handler";
import Booking from "@entities/booking";
import gcm from "node-gcm";
import { StatusCodes } from "http-status-codes";

const notificationSender = new gcm.Sender(`${process.env.FCM_API_KEY}`);

const dropAll = catchAsync(async (req: IRequest, res: Response) => {
  await mongoose.connection.db.dropDatabase();
  sendResponse(null, 204, null, res);
});

const getDashboardData = catchAsync(async () => {});

const getBookings = handler.getMultiple(Booking);
const updateBooking = handler.updateOne(Booking);

const sendPushNotification = catchAsync(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const message = new gcm.Message(req.body["notification"]);
    const to = req.body["to"];

    notificationSender.send(message, to, (err, response) => {
      if (err) throw err;
      sendResponse(response, StatusCodes.OK, "Notification sent.", res);
    });
  }
);

export default {
  dropAll,
  getDashboardData,
  getBookings,
  updateBooking,
  sendPushNotification,
};
