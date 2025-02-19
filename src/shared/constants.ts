import { Request } from "express";
import { IUser } from "@entities/user";

export const paramMissingError =
  "One or more of the required parameters was missing.";

export interface IRequest extends Request {
  body: any;
  user: IUser;
}
