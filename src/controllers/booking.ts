import Booking from "@entities/booking";
import catchAsync from "../utils/catch-async";
import { IRequest } from "@shared/constants";
import { Response, NextFunction } from "express";
import sendResponse from "../utils/send-response";
import AppError from "../utils/app-error";
import { StatusCodes } from "http-status-codes";
import CartItem, { ICartItem } from "../entities/cart-item";
import handler from "./handler";

const getBookings = catchAsync(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const doc = await Booking.find({ user: req.user._id });
    if (!doc)
      return next(new AppError(StatusCodes.NOT_FOUND, "Bookings not found."));

    sendResponse(doc, 200, "Bookings fetched successfully.", res);
  }
);

const getBooking = catchAsync(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const doc = await Booking.findById(req.params.id).populate("cart");
    if (!doc)
      return next(new AppError(StatusCodes.NOT_FOUND, "Booking not found."));

    sendResponse(doc, 200, "Booking fetched successfully.", res);
  }
);

const addBooking = catchAsync(
  async (req: IRequest, res: Response, next: NextFunction) => {
    // Calculate amount. (Don't trust client)
    const cart = req.body.cart;
    const amount = await calculateAmount(cart);
    req.body.amount = amount;
    req.body.user = req.user._id;

    const doc = await Booking.create(req.body);
    if (!doc)
      return next(new AppError(StatusCodes.NOT_FOUND, "Document not created."));

    sendResponse(doc, 201, "Booking added successfully.", res);
  }
);

const updateBooking = catchAsync(
  async (req: IRequest, res: Response, next: NextFunction) => {
    // Calculate amount. (Again..., don't trust client)
    const cart = req.body.cart;
    const amount = await calculateAmount(cart);
    req.body.amount = amount;
    if (req.body.user) req.body.user = req.user._id;

    const doc = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc)
      return next(new AppError(StatusCodes.NOT_FOUND, "Document not updated."));

    sendResponse(doc, 201, "Booking updated successfully.", res);
  }
);

const deleteBooking = handler.deleteOne(Booking);

const calculateAmount = async (cart: [ICartItem]) => {
  let amount = 0;
  const cartItems: ICartItem[] = await CartItem.find({ _id: cart });

  for (const cartItem of cartItems) {
    amount += cartItem?.unitCost * cartItem?.quantity;
  }
  return amount;
};

export default {
  getBookings,
  getBooking,
  addBooking,
  updateBooking,
  deleteBooking,
};
