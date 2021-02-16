import { NextFunction, Request, Response } from "express";

export default (fun: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fun(req, res, next).catch(next);
  };
};
