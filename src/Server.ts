import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import helmet from "helmet";

import express, {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
  Handler,
} from "express";
import "express-async-errors";

import BaseRouter from "./routes";
import globalErrorHandler from "./controllers/error";
import { IRequest } from "@shared/constants";

const app = express();

// CORS settings
const allowCrossDomain = function (
  req: IRequest,
  res: Response,
  next: NextFunction
) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "*");
  next();
};

app.use(allowCrossDomain as Handler);
/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Show routes called in console during development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Security
if (process.env.NODE_ENV === "production") {
  app.use(helmet());
}

// Add APIs
app.use("/api/v1", BaseRouter);

// Error handler
app.use(globalErrorHandler as ErrorRequestHandler);

/************************************************************************************
 *                              Serve front-end content
 ***********************************************************************************/

const viewsDir = path.join(__dirname, "views");
app.set("views", viewsDir);
const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));
app.get("*", (req: Request, res: Response) => {
  res.sendFile("index.html", { root: viewsDir });
});

// Export express instance
export default app;
