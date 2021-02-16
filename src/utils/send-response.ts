import { StatusCodes } from "http-status-codes";
import { Response } from "express";

const sendResponse = (
  data: any,
  statusCode: StatusCodes,
  message: string | null,
  res: Response
) => {
  res.status(statusCode).json({ message, data });
};

export default sendResponse;
